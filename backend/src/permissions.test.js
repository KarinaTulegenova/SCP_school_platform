import test from 'node:test';
import assert from 'node:assert/strict';
import { hasPermission } from './permissions.js';

test('student permissions are restricted to learner actions', () => {
  assert.equal(hasPermission('STUDENT', 'lesson:read'), true);
  assert.equal(hasPermission('STUDENT', 'lesson:publish'), false);
  assert.equal(hasPermission('STUDENT', 'homework:review'), false);
  assert.equal(hasPermission('STUDENT', 'user:manage'), false);
});

test('teacher can manage users and publish lessons but cannot manage schedule', () => {
  assert.equal(hasPermission('TEACHER', 'user:manage'), true);
  assert.equal(hasPermission('TEACHER', 'lesson:publish'), true);
  assert.equal(hasPermission('TEACHER', 'homework:review'), true);
  assert.equal(hasPermission('TEACHER', 'schedule:manage'), false);
});

test('admin has full platform permissions', () => {
  assert.equal(hasPermission('ADMIN', 'schedule:manage'), true);
  assert.equal(hasPermission('ADMIN', 'progress:read:class'), true);
});
