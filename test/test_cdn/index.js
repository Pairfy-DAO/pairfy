import { Client } from 'minio';

const client = new Client({
  endPoint: '',
  accessKey: "",
  secretKey: "",
  useSSL: true,
  pathStyle: true, // DO Spaces
});

client.listBuckets()
  .then(async buckets => {
    console.log('✅  Buckets:', buckets.map(b => b.name));

    //await client.removeBucket('media');

    const exist = await client.bucketExists('media')
    
    console.log(exist)

    const test = client.getObject('pairfy-media-prod', "groups/5594f03d-7838-cfa1-735a-d09a10dd0ca9/MAkT7K6Y6xrZLc7L-6.jpg")
  })
  .catch(err => {
    console.error('❌ Error DigitalOcean Spaces:', err);
  });
