import { uploadFolder } from "../azure";

export async function POST(req) {
  const files = req.body;
  uploadFolder(files);
  return Response.json({ message: "SUCCESS" });
}
