namespace Wordapp;

using Npgsql;

public class Database
{

    private readonly string _host = "45.10.162.204";
    private readonly string _port = "5434";
    private readonly string _username = "postgres";
    private readonly string _password = "CarefulDriverJumps46"; 
    private readonly string _database = "drawesome";

    private NpgsqlDataSource _connection;

    public NpgsqlDataSource Connection()
    {
        return _connection;
    }

    public Database()
    {
        string connectionString = $"Host={_host};Port={_port};Username={_username};Password={_password};Database={_database}";
        _connection = NpgsqlDataSource.Create(connectionString);
    }
}