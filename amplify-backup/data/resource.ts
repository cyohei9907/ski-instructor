import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

/*== STEP 1 ===============================================================
The section below creates a Todo database table with a "content" field. Try
adding a new "isDone" field as a boolean. The authorization rule below
specifies that any user authenticated via an API key can "create", "read",
"update", and "delete" any "Todo" records.
=========================================================================*/
const schema = a.schema({
  Todo: a
    .model({
      content: a.string(),
    })
    .authorization((allow) => [allow.publicApiKey()]),
  // 教练表
  Instructor: a.model({
    nickname: a.string(),                      // 教练昵称
    location: a.string().array(),           // 所在地区
    skiResorts: a.string().array(),         // 所在雪场
    bloodType: a.string(),          // 血型（可选）
    zodiac: a.string(),             // 星座（可选）
    bio: a.string(),                // 自我介绍
    specialties: a.string().array(),        // 擅长板
    avatar: a.string(),                        // 头像 URL
    photoWall: a.string().array(), // 照片墙（数组，URL）
    skiCertificates: a.string().array(), // 滑雪证件（数组）
  })
  .authorization((allow) => [allow.publicApiKey()]),
  Course: a.model({
    instructor: a.id(),          // 教练（外键，关联 instructor 表）
    name: a.string(),               // 课程名
    photoWall: a.string().array(),  // 课程照片墙
    price: a.integer(),             // 价格
    targetAudience: a.string(),     // 授课对象
    description: a.string(),        // 课程介绍
  })
  .authorization((allow) => [allow.publicApiKey()]),
  
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    // API Key is used for a.allow.public() rules
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});

/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
WORK IN THE FRONTEND CODE FILE.)

Using JavaScript or Next.js React Server Components, Middleware, Server 
Actions or Pages Router? Review how to generate Data clients for those use
cases: https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/
=========================================================================*/

/*
"use client"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>() // use this Data client for CRUDL requests
*/

/*== STEP 3 ===============================================================
Fetch records from the database and use them in your frontend component.
(THIS SNIPPET WILL ONLY WORK IN THE FRONTEND CODE FILE.)
=========================================================================*/

/* For example, in a React component, you can use this snippet in your
  function's RETURN statement */
// const { data: todos } = await client.models.Todo.list()

// return <ul>{todos.map(todo => <li key={todo.id}>{todo.content}</li>)}</ul>
