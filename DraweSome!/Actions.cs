using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Npgsql;

namespace Wordapp
{
    public class Actions
    {
        private readonly Database _database;
        private readonly NpgsqlDataSource _db;

        public Actions(WebApplication app)
        {
            _database = new Database();
            _db = _database.Connection();

            app.MapGet("/get-drawings", async () => 
            {
                try
                {
                    await using var conn = _db.CreateConnection();
                    await conn.OpenAsync();
                    await using var cmd = conn.CreateCommand();

                    cmd.CommandText = @"
                        SELECT id, drawing_word, drawing_image_url
                        FROM drawings
                    ";

                    await using var reader = await cmd.ExecuteReaderAsync();
                    var drawings = new List<object>();

                    while (await reader.ReadAsync())
                    {
                        int id = reader.GetInt32(0);
                        string word = reader.GetString(1);
                        byte[] imageBytes = reader.GetFieldValue<byte[]>(2);

                        string base64 = Convert.ToBase64String(imageBytes);

                        drawings.Add(new
                        {
                            Id = id,
                            Word = word,
                            ImageData = base64
                        });
                    }
                    return Results.Ok(drawings);
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error retrieving drawings: {ex.Message}");
                    return Results.Problem(detail: "Failed to retrieve drawings.", statusCode: 500);
                }
            });

            app.MapPost("/save-drawing", async (DrawingRequest request) => 
            {
                try
                {
                    bool success = await SaveDrawing(request.DrawingWord, request.DrawingData);
                    if (!success)
                    {
                        return Results.Problem(detail: "Error inserting drawing into DB", statusCode: 500);
                    }
                    return Results.Ok("Drawing successfully saved!");
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error saving drawing: {ex.Message}");
                    return Results.Problem(detail: "Error saving drawing", statusCode: 500);
                }
            });

            app.MapDelete("/clear-drawings", async () =>
            {
                try
                {
                    await using var conn = _db.CreateConnection();
                    await conn.OpenAsync();

                    await using var cmd = conn.CreateCommand();

                    cmd.CommandText = "DELETE FROM drawings";
                    int rowsAffected = await cmd.ExecuteNonQueryAsync();
                    return Results.Ok($"Deleted {rowsAffected} rows from drawings table.");
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error clearing drawings: {ex.Message}");
                    return Results.Problem(detail: "Failed to clear drawings table.", statusCode: 500);
                }
            });
        }

        public async Task<bool> SaveDrawing(string drawingWord, string drawingBase64) 
        {
            try
            {
                int commaIndex = drawingBase64.IndexOf(',');
                if (commaIndex >= 0)
                {
                    drawingBase64 = drawingBase64.Substring(commaIndex + 1);
                }

                byte[] imageBytes = Convert.FromBase64String(drawingBase64);

                await using var conn = _db.CreateConnection();
                await conn.OpenAsync();

                await using var cmd = conn.CreateCommand();
                cmd.CommandText = @"
                    INSERT INTO drawings (drawing_word, drawing_image_url)
                    VALUES (@word, @img)
                ";

                cmd.Parameters.AddWithValue("@word", drawingWord);
                cmd.Parameters.AddWithValue("@img", imageBytes);

                int rowsAffected = await cmd.ExecuteNonQueryAsync();
                return (rowsAffected > 0);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error saving drawing to database: {ex.Message}");
                return false;
            }
        }
    }

    public class DrawingRequest
    {
        public string DrawingWord { get; set; } = string.Empty; 
        public string DrawingData { get; set; } = string.Empty; 
    }
}
