//****** incorrect seeding script not in use users password requires hashing cant be seeded*****
import { drizzle } from "drizzle-orm/mysql2";
import { seed } from "drizzle-seed";
import * as schema from "./src/db/schema";
import mysql from "mysql2/promise";

async function main() {
  const connection = await mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "12345",
    database: "threadhive",
  });

  const db = drizzle(connection);

  await seed(db, schema).refine((f) => ({
    channel: {
      count: 30,
      columns: {
        name: f.companyName(),
        created_at: f.timestamp(),
        is_deleted: f.boolean(),
      },
    },
    users: {
      count: 30,
      columns: {
        name: f.fullName(),
        email: f.email(),
        password: f.string(),
        role: f.valuesFromArray({ values: ["ADMIN", "SUPERADMIN", "USER"] }),
        created_at: f.timestamp(),
        dob: f.date(),
        is_deleted: f.boolean(),
      },
    },
    posts: {
      count: 100,
      columns: {
        title: f.string(),
        description: f.loremIpsum(),
        created_at: f.timestamp(),
        is_deleted: f.boolean(),
        created_by: f.int({ minValue: 1, maxValue: 100 }), // Assuming created_by refers to user_id from users table
        modified_by: f.int({ minValue: 1, maxValue: 100 }), // Assuming modified_by refers to user_id from users table
        channel_id: f.int({ minValue: 1, maxValue: 100 }), // Assuming channel_id refers to channel table
      },
    },
    comments: {
      count: 100,
      columns: {
        description: f.loremIpsum(),
        created_at: f.timestamp(),
        is_deleted: f.boolean(),
        created_by: f.int({ minValue: 1, maxValue: 100 }), // Assuming created_by refers to user_id from users table
        modified_by: f.int({ minValue: 1, maxValue: 100 }), // Assuming modified_by refers to user_id from users table
        post_id: f.int({ minValue: 1, maxValue: 100 }), // Assuming post_id refers to posts table
        channel_id: f.int({ minValue: 1, maxValue: 100 }), // Assuming channel_id refers to channel table
      },
    },
    replies: {
      count: 100,
      columns: {
        description: f.loremIpsum(),
        created_at: f.timestamp(),
        is_deleted: f.boolean(),
        created_by: f.int({ minValue: 1, maxValue: 100 }), // Assuming created_by refers to user_id from users table
        modified_by: f.int({ minValue: 1, maxValue: 100 }), // Assuming modified_by refers to user_id from users table
        post_id: f.int({ minValue: 1, maxValue: 100 }), // Assuming post_id refers to posts table
        comment_id: f.int({ minValue: 1, maxValue: 100 }), // Assuming comment_id refers to comments table
        channel_id: f.int({ minValue: 1, maxValue: 100 }), // Assuming channel_id refers to channel table
      },
    },
    likes: {
      count: 100,
      columns: {
        type: f.valuesFromArray({ values: ["POST", "COMMENT", "REPLY"] }),
        type_id: f.int({ minValue: 1, maxValue: 100 }),
        liked_by: f.int({ minValue: 1, maxValue: 100 }), // Assuming liked_by refers to user_id from users table
        count: f.int({ minValue: 1 }),
        post_id: f.int({ minValue: 1, maxValue: 100 }), // Assuming post_id refers to posts table
        channel_id: f.int({ minValue: 1, maxValue: 100 }), // Assuming channel_id refers to channel table
      },
    },
    activities: {
      count: 100,
      columns: {
        activity: f.string(),
        created_at: f.timestamp(),
        action_by: f.int({ minValue: 1, maxValue: 100 }), // Assuming action_by refers to user_id from users table
        additional_data: f.json(),
        channel_id: f.int({ minValue: 1, maxValue: 100 }), // Assuming channel_id refers to channel table
      },
    },
  }));

  console.log("Database seeded successfully!");
  await connection.end();
}

main().catch((err) => console.error(err));
