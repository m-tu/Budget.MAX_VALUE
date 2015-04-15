let isServer = typeof window !== 'undefined';

api.auth.login({
  username: 'timmu',
  password: 'parool'
})

api.post('/auth/login')