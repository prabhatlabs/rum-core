import { GitHub, Google } from 'arctic'
import { ENV } from '../constants/envvars'

export const google = new Google(
  ENV.GOOGLE_CLIENT_ID,
  ENV.GOOGLE_CLIENT_SECRET,
  `${ENV.BACKEND_URL}/auth/google/callback`
)

export const github = new GitHub(
  ENV.GITHUB_CLIENT_ID,
  ENV.GITHUB_CLIENT_SECRET,
  `${ENV.BACKEND_URL}/auth/github/callback`
)