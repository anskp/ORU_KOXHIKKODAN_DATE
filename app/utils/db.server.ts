import { createClient, type Client } from '@libsql/client';
    import { Buffer } from 'buffer'; // Node.js Buffer

    let client: Client | null = null;

    function getClient(): Client {
      if (client) {
        return client;
      }
      // In WebContainer, we'll use a local file.
      // The file path needs to be accessible within the virtual filesystem.
      // Let's store it in a 'data' directory.
      client = createClient({
        url: 'file:data/local.db',
      });
      return client;
    }

    // Function to ensure the users table exists
    export async function initSchema() {
      const db = getClient();
      try {
        await db.execute(`
          CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            age INTEGER NOT NULL,
            photo_base64 TEXT, -- Store photo as Base64 string
            photo_type TEXT,   -- Store original MIME type
            hobby TEXT,
            qualification TEXT,
            role TEXT,
            interests TEXT,
            place TEXT,
            income INTEGER,
            bio TEXT, -- Added Bio field
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
          );
        `);
        console.log("Database schema initialized successfully.");
      } catch (error) {
        console.error("Error initializing database schema:", error);
        // Handle specific errors if needed
        if (error.code === 'SQLITE_READONLY') {
          console.error("Database is read-only. Check file permissions or configuration.");
        }
        throw error; // Re-throw the error if you want calling code to handle it
      }
    }

    // Type definition for user data
    export interface UserData {
      name: string;
      age: number;
      photoBuffer: ArrayBuffer;
      photoType: string;
      hobby?: string;
      qualification?: string;
      role?: string;
      interests?: string;
      place?: string;
      income?: number | null;
      bio?: string;
    }

    // Function to add a new user
    export async function addUser(userData: UserData): Promise<{ id: number | bigint | undefined } | { error: string }> {
      await initSchema(); // Ensure table exists before inserting
      const db = getClient();

      // Convert ArrayBuffer to Base64 string
      const photoBase64 = Buffer.from(userData.photoBuffer).toString('base64');

      try {
        const result = await db.execute({
          sql: `
            INSERT INTO users (name, age, photo_base64, photo_type, hobby, qualification, role, interests, place, income, bio)
            VALUES (:name, :age, :photo_base64, :photo_type, :hobby, :qualification, :role, :interests, :place, :income, :bio)
          `,
          args: {
            name: userData.name,
            age: userData.age,
            photo_base64: photoBase64,
            photo_type: userData.photoType,
            hobby: userData.hobby ?? null,
            qualification: userData.qualification ?? null,
            role: userData.role ?? null,
            interests: userData.interests ?? null,
            place: userData.place ?? null,
            income: userData.income ?? null,
            bio: userData.bio ?? null,
          },
        });
        console.log("User added successfully, ID:", result.lastInsertRowid);
        return { id: result.lastInsertRowid };
      } catch (error) {
        console.error("Error adding user:", error);
        return { error: "Failed to add user to the database." };
      }
    }

    // Add other database functions here (e.g., getUser, getUsers, deleteUser)
    // Example:
    export async function getUsers() {
      await initSchema();
      const db = getClient();
      try {
        const result = await db.execute("SELECT id, name, age, hobby, qualification, role, interests, place, income, bio, created_at FROM users ORDER BY created_at DESC");
        return result.rows;
      } catch (error) {
        console.error("Error fetching users:", error);
        return [];
      }
    }

     export async function getUserById(id: number) {
      await initSchema();
      const db = getClient();
      try {
        const result = await db.execute({
            sql: "SELECT id, name, age, photo_base64, photo_type, hobby, qualification, role, interests, place, income, bio, created_at FROM users WHERE id = :id",
            args: { id }
        });
        return result.rows[0] ?? null; // Return the first row or null if not found
      } catch (error) {
        console.error(`Error fetching user with id ${id}:`, error);
        return null;
      }
    }