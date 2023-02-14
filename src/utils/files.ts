import { Dropbox } from 'dropbox';
import axios from "axios"
import * as fs from 'fs';
import * as path from 'path';

import 'dotenv/config';

export const getDataToDownload = async () => {
  const dbx: Dropbox = new Dropbox({ accessToken: process.env.DROPBOX_TOKEN });
  const data = [];
  const respons = await dbx.filesListFolder({ path: '' });

  for (const entry of respons.result.entries) {
    if (entry[".tag"] === "file") {
      data.push({
        id: entry.id,
        name: entry.name
      })
    }
  }
  return data;
}

export const downloadFile = async (id: string, name: string) => {
  axios({
    method: 'POST',
    url: 'https://content.dropboxapi.com/2/files/download',
    headers: {
      'Authorization': `Bearer ${process.env.DROPBOX_TOKEN}`,
      'Dropbox-API-Arg': JSON.stringify({ "path": id }),
      'Content-Type': 'application/octet-stream'
    },
    responseType: 'arraybuffer'
  })
    .then(response => {
      fs.promises.writeFile(`${name}`, response.data);
      console.log(`File ${name} successfully download`)
    })
    .catch(error => {
      console.error(error);
    });
}

export const uploadFile = async (filePath: string) => {

  const dbx = new Dropbox({ accessToken: process.env.DROPBOX_TOKEN });

  const fileData = fs.readFileSync(filePath);
  const fileName = path.basename(filePath);
  
  dbx.filesUpload({ path: '/' + fileName, contents: fileData })
    .then((response) => {
      console.log(`File ${fileName} successfully upload`)
    })
    .catch(function(error) {
      console.error(error);
    });
} 