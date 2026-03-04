/**
 * Fix Media URLs - Change from broken proxy URLs to direct R2 URLs
 * Run with: node fix-media-urls.js
 */

const https = require('https');

const ADMIN_TOKEN = 'YOUR_ADMIN_TOKEN_HERE'; // Marco needs to provide this

// Function to get all projects with media
async function getProjects() {
  return new Promise((resolve, reject) => {
    https.get('https://marcomotion.com/api/projects', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
      res.on('error', reject);
    });
  });
}

// Function to update media URL in database
async function updateMediaUrl(mediaId, newUrl) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ mediaUrl: newUrl });
    const options = {
      hostname: 'marcomotion.com',
      path: `/api/admin/media/${mediaId}`,
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${ADMIN_TOKEN}`,
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };

    const req = https.request(options, (res) => {
      let response = '';
      res.on('data', chunk => response += chunk);
      res.on('end', () => resolve(JSON.parse(response)));
      res.on('error', reject);
    });

    req.write(data);
    req.end();
  });
}

async function main() {
  console.log('🔍 Fetching projects...');
  const result = await getProjects();

  if (!result.success) {
    console.error('❌ Failed to fetch projects');
    return;
  }

  const projects = result.data;
  console.log(`✅ Found ${projects.length} projects\n`);

  let fixed = 0;
  let already_ok = 0;

  for (const project of projects) {
    console.log(`📁 Project: ${project.display_name_en}`);

    if (!project.media || project.media.length === 0) {
      console.log('  ℹ️  No media\n');
      continue;
    }

    for (const media of project.media) {
      const url = media.media_url;

      // Check if URL needs fixing (uses proxy format)
      if (url.includes('marcomotion.com/api/media/')) {
        const key = url.split('/').pop();
        const newUrl = `https://pub-53d4a6f5b3144ad7aaceddf9c6415871.r2.dev/${key}`;

        console.log(`  🔧 Fixing: ${media.id}`);
        console.log(`     Old: ${url}`);
        console.log(`     New: ${newUrl}`);

        // TODO: Uncomment when ready to apply
        // await updateMediaUrl(media.id, newUrl);

        fixed++;
      } else {
        console.log(`  ✅ OK: ${media.id}`);
        already_ok++;
      }
    }
    console.log('');
  }

  console.log('\n📊 Summary:');
  console.log(`   Fixed: ${fixed}`);
  console.log(`   Already OK: ${already_ok}`);
  console.log(`   Total: ${fixed + already_ok}`);
}

main().catch(console.error);
