import { Readable } from "stream";

const fs = require("fs");
const path = require("path");

const { BlobServiceClient } = require("@azure/storage-blob");
const connectionString = `DefaultEndpointsProtocol=https;AccountName=${process.env.ACCOUNT_NAME};AccountKey=${process.env.ACCOUNT_KEY};EndpointSuffix=core.windows.net`;
const blobServiceClient =
  BlobServiceClient.fromConnectionString(connectionString);
const containerName = process.env.CONTAINER_NAME;
const userId = process.env.USER_ID;

export async function getFileList() {
  const containerClient = blobServiceClient.getContainerClient(containerName);
  const blobList = containerClient.listBlobsFlat();
  const files = [];
  for await (const blob of blobList) {
    files.push(blob.name);
  }

  // split on '/'. first is userid, second is case id, third is file name
  const formattedFiles = files.reduce((acc, file) => {
    const [userId, caseId, fileName] = file.split("/");
    if (!acc[userId]) {
      acc[userId] = {};
    }
    if (!acc[userId][caseId]) {
      acc[userId][caseId] = [];
    }

    acc[userId][caseId].push(fileName);
    const transformedArray = [];

    return acc;
  }, {});
  const transformedArray = [];
  for (const userId in formattedFiles) {
    for (const caseId in formattedFiles[userId]) {
      const entry = {
        userId: userId,
        caseId: caseId,
        fileName: formattedFiles[userId][caseId],
      };
      transformedArray.push(entry);
    }
  }
  return transformedArray;
}
// Function to upload a buffer to Azure Blob Storage
export async function uploadBuffer(buffer, blobName) {
  const containerClient = blobServiceClient.getContainerClient(containerName);
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);
  await blockBlobClient.upload(buffer, buffer.length);
}
