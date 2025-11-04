const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')

const adminLoginCardPath = path.join(__dirname, '..', 'components', 'auth', 'admin-login-card.tsx')

test('admin login card emphasises restricted access', () => {
  const content = fs.readFileSync(adminLoginCardPath, 'utf8')
  assert.match(
    content,
    /Only authorized administrators can access this portal. Contact the database administrator to\s+request credentials\./,
    'Admin login copy should instruct users to contact the database administrator'
  )
})

test('admin login card no longer links to sign up', () => {
  const content = fs.readFileSync(adminLoginCardPath, 'utf8')
  assert.ok(!content.includes('Sign up'), 'Sign-up link should be removed from the admin login card')
})
