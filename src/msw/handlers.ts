import { http, HttpResponse, RequestHandler } from "msw";
import { sleep } from "../utils/sleep";
import { NoteInfoType } from "../shared/CommonTypes.interface";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { nanoid } from "nanoid";

dayjs.extend(utc);

const notes: NoteInfoType[] = [
  {
    id: "EldicFbewkJW-DYunEbT4",
    title: "Title 1",
    description: "Description 1",
    createdTimestamp: dayjs().utc().format(),
  },
  {
    id: "D9l0Istk6Uw-bhO-8mVKi",
    title: "Title 2",
    description: "Description 2",
    createdTimestamp: dayjs().utc().format(),
  },
  {
    id: "3Yfxh8o9-bvrunrwdhekk",
    title: "Title 3",
    description: "Description 3",
    createdTimestamp: dayjs().utc().format(),
  },
];

const notesMap = new Map(notes.map((note) => [note.id, note]));

export const handlers: RequestHandler[] = [
  http.post("/api/login", async ({ request }) => {
    await sleep(500 + Math.random() * 500);

    const { username, password } = (await request.json()) as {
      username: string;
      password: string;
    };

    if (username === "admin" && password === "password") {
      return HttpResponse.json({
        fullname: "John Smith",
        username: username,
        accessToken: "THE_TOKEN",
      });
    }

    return HttpResponse.json({ error: "Not authorised" }, { status: 401 });
  }),

  http.post("/api/authenticate", () => {
    return HttpResponse.text("");
  }),

  /**
   * CRUD of notes
   */
  ...[
    // GET ALL
    http.get("/api/get-all-personal-notes", async () => {
      await sleep(500 + Math.random() * 500);

      return HttpResponse.json({ notes: Array.from(notesMap.values()) });
    }),

    // CREATE NEW NOTE
    http.post("/api/create-new-note", async ({ request }) => {
      await sleep(500 + Math.random() * 500);

      const id = nanoid();

      const { title, description } = (await request.json()) as NoteInfoType;

      notesMap.set(id, {
        createdTimestamp: dayjs().utc().format(),
        description: description,
        title: title,
        id: id,
      });

      return HttpResponse.json(notesMap.get(id));
    }),

    // DELETE BY ID
    http.delete("/api/delete-note-by-id/:noteId", async ({ params }) => {
      await sleep(500 + Math.random() * 500);
      const { noteId } = params;

      if (notesMap.delete(String(noteId))) {
        return new HttpResponse(null, { status: 204 });
      }

      return HttpResponse.json(
        { error: `Note ${noteId} not found` },
        { status: 500 }
      );
    }),
  ],
];
