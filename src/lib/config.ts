export const config = {
  jwt: {
    secret: process.env.JWT_SECRET || 'fallback-secret-key',
    expiresIn: '7d'
  },
  bcrypt: {
    rounds: parseInt(process.env.BCRYPT_ROUNDS || '12')
  },
  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760'),
    allowedTypes: (process.env.ALLOWED_FILE_TYPES || 'pdf,docx,doc,jpg,jpeg,png,webp').split(','),
    bucket: process.env.SUPABASE_BUCKET_NAME || 'document-vault'
  },
  aws: {
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    bucketName: process.env.AWS_BUCKET_NAME
  },
  app: {
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    name: 'Student Documentation Vault'
  }
}

export const documentCategories = [
  'resume',
  'degrees',
  'certificates',
  'transcripts',
  'headshots',
  'others'
] as const

export type DocumentCategory = typeof documentCategories[number]