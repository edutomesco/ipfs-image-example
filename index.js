import {create} from 'ipfs-http-client'
import FileReader from 'filereader'
import * as fs from 'fs'

async function ipfsClient() {
    const ipfs = await create(
        {
            host: "ipfs.infura.io",
            port: 5001,
            protocol: "https"
        }
    )
    return ipfs
}

/*const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    if (file) {
        fileReader.readAsDataURL(file);
    }
    fileReader.onload = () => {
        resolve(fileReader.result);
    };
    fileReader.onerror = (error) => {
        reject(error);
    };
    });
};*/

async function main() {
    const img = fs.readFileSync('asset/image.png')
    const imgBase64 = img.toString('base64')
    
    const ipfs = await ipfsClient()
    const { cid } = await ipfs.add(imgBase64)
    console.log(cid)

    const stream = ipfs.cat(cid)
    let data = ''

    for await (const chunk of stream) {
        data += chunk.toString()
    }

    let buff = Buffer.from(data, 'base64')
    fs.writeFileSync('result.png', buff);
}

main()
  .then(() => process.exit(0))
  .catch(console.error);
