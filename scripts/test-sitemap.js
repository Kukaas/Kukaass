import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('Testing sitemap generation...');

try {
  // Run the build
  console.log('Building the project...');
  execSync('npm run build', { stdio: 'inherit' });

  // Check if sitemap was generated
  const sitemapPath = path.join('.next', 'server', 'app', 'sitemap.xml.body');

  if (fs.existsSync(sitemapPath)) {
    const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
    console.log('\n✅ Sitemap generated successfully!');
    console.log('\nSitemap content:');
    console.log(sitemapContent);

    // Count URLs
    const urlCount = (sitemapContent.match(/<url>/g) || []).length;
    console.log(`\n📊 Total URLs in sitemap: ${urlCount}`);
  } else {
    console.log('\n❌ Sitemap not found!');
  }
} catch (error) {
  console.error('\n❌ Error during build:', error.message);
}
