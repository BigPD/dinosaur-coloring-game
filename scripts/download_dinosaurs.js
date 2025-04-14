const https = require('https');
const fs = require('fs');
const path = require('path');

const dinosaurs = [
  {
    name: 'trex',
    url: 'https://raw.githubusercontent.com/mdn/webextensions-examples/master/beastify/beasts/frog.jpg'
  },
  {
    name: 'stegosaurus',
    url: 'https://raw.githubusercontent.com/mdn/webextensions-examples/master/beastify/beasts/turtle.jpg'
  },
  {
    name: 'triceratops',
    url: 'https://raw.githubusercontent.com/mdn/webextensions-examples/master/beastify/beasts/snake.jpg'
  },
  {
    name: 'brachiosaurus',
    url: 'https://raw.githubusercontent.com/mdn/webextensions-examples/master/beastify/beasts/octopus.jpg'
  },
  {
    name: 'velociraptor',
    url: 'https://raw.githubusercontent.com/mdn/webextensions-examples/master/beastify/beasts/rabbit.jpg'
  }
];

const outputDir = path.join(__dirname, '../public/dinosaurs/real');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(path.join(outputDir, filename));
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${filename}: ${response.statusCode}`));
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filename, () => {});
      reject(err);
    });
  });
}

async function downloadAll() {
  for (const dino of dinosaurs) {
    try {
      console.log(`Downloading ${dino.name}...`);
      await downloadImage(dino.url, `${dino.name}.png`);
      console.log(`Successfully downloaded ${dino.name}`);
    } catch (error) {
      console.error(`Error downloading ${dino.name}:`, error.message);
    }
  }
  console.log('Download process completed');
}

downloadAll(); 