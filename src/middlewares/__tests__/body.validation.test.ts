import { describe, expect, test } from '@jest/globals';
import { validationResult } from 'express-validator';
import { createProjectValidation, updateProjectValidation } from '../body.validation';
import type { Request, Response } from 'express';

// Mock Express Request
const createMockRequest = (body: any): Partial<Request> => ({
  body,
});

// Mock Express Response
const createMockResponse = (): Partial<Response> => ({});

// Helper to run validations
const runValidations = async (
  validations: any[],
  req: Partial<Request>,
  res: Partial<Response>
) => {
  for (const validation of validations) {
    await validation.run(req);
  }
  return validationResult(req as Request);
};

describe('createProjectValidation', () => {
  test('should pass with valid complete project data', async () => {
    const req = createMockRequest({
      name: 'Test Project',
      description: 'Test Description',
      status: 'in progress',
      startDate: '2025-01-01T00:00:00.000Z',
    });
    const res = createMockResponse();

    const result = await runValidations(createProjectValidation, req, res);

    expect(result.isEmpty()).toBe(true);
  });

  test('should pass with valid completed project with endDate', async () => {
    const req = createMockRequest({
      name: 'Completed Project',
      description: 'Completed Description',
      status: 'completed',
      startDate: '2025-01-01T00:00:00.000Z',
      endDate: '2025-12-31T00:00:00.000Z',
    });
    const res = createMockResponse();

    const result = await runValidations(createProjectValidation, req, res);

    expect(result.isEmpty()).toBe(true);
  });

  test('should fail when name is missing', async () => {
    const req = createMockRequest({
      description: 'Test Description',
      status: 'in progress',
      startDate: '2025-01-01T00:00:00.000Z',
    });
    const res = createMockResponse();

    const result = await runValidations(createProjectValidation, req, res);

    expect(result.isEmpty()).toBe(false);
    const errors = result.array();
    expect(errors.some((e: any) => e.path === 'name')).toBe(true);
  });

  test('should fail when description is missing', async () => {
    const req = createMockRequest({
      name: 'Test Project',
      status: 'in progress',
      startDate: '2025-01-01T00:00:00.000Z',
    });
    const res = createMockResponse();

    const result = await runValidations(createProjectValidation, req, res);

    expect(result.isEmpty()).toBe(false);
    const errors = result.array();
    expect(errors.some((e: any) => e.path === 'description')).toBe(true);
  });

  test('should fail when status is invalid', async () => {
    const req = createMockRequest({
      name: 'Test Project',
      description: 'Test Description',
      status: 'invalid-status',
      startDate: '2025-01-01T00:00:00.000Z',
    });
    const res = createMockResponse();

    const result = await runValidations(createProjectValidation, req, res);

    expect(result.isEmpty()).toBe(false);
    const errors = result.array();
    expect(errors.some((e: any) => e.path === 'status')).toBe(true);
  });

  test('should accept case-insensitive status values', async () => {
    const reqUpperCase = createMockRequest({
      name: 'Test Project',
      description: 'Test Description',
      status: 'IN PROGRESS',
      startDate: '2025-01-01T00:00:00.000Z',
    });

    const result = await runValidations(
      createProjectValidation,
      reqUpperCase,
      createMockResponse()
    );

    expect(result.isEmpty()).toBe(true);
  });

  test('should fail when startDate is invalid format', async () => {
    const req = createMockRequest({
      name: 'Test Project',
      description: 'Test Description',
      status: 'in progress',
      startDate: 'invalid-date',
    });
    const res = createMockResponse();

    const result = await runValidations(createProjectValidation, req, res);

    expect(result.isEmpty()).toBe(false);
    const errors = result.array();
    expect(errors.some((e: any) => e.path === 'startDate')).toBe(true);
  });

  test('should pass when endDate is null for "in progress" status', async () => {
    const req = createMockRequest({
      name: 'Test Project',
      description: 'Test Description',
      status: 'in progress',
      startDate: '2025-01-01T00:00:00.000Z',
      endDate: null,
    });
    const res = createMockResponse();

    const result = await runValidations(createProjectValidation, req, res);

    expect(result.isEmpty()).toBe(true);
  });

  test('should fail when endDate has invalid format', async () => {
    const req = createMockRequest({
      name: 'Test Project',
      description: 'Test Description',
      status: 'completed',
      startDate: '2025-01-01T00:00:00.000Z',
      endDate: 'invalid-date-format',
    });
    const res = createMockResponse();

    const result = await runValidations(createProjectValidation, req, res);

    expect(result.isEmpty()).toBe(false);
    const errors = result.array();
    expect(errors.some((e: any) => e.path === 'endDate')).toBe(true);
  });
});

describe('updateProjectValidation', () => {
  test('should pass with only status field', async () => {
    const req = createMockRequest({
      status: 'completed',
    });
    const res = createMockResponse();

    const result = await runValidations(updateProjectValidation, req, res);

    expect(result.isEmpty()).toBe(true);
  });

  test('should pass with only name field', async () => {
    const req = createMockRequest({
      name: 'Updated Name',
    });
    const res = createMockResponse();

    const result = await runValidations(updateProjectValidation, req, res);

    expect(result.isEmpty()).toBe(true);
  });

  test('should pass with multiple optional fields', async () => {
    const req = createMockRequest({
      name: 'Updated Project',
      description: 'Updated Description',
      status: 'in progress',
    });
    const res = createMockResponse();

    const result = await runValidations(updateProjectValidation, req, res);

    expect(result.isEmpty()).toBe(true);
  });

  test('should pass with empty body (all fields optional)', async () => {
    const req = createMockRequest({});
    const res = createMockResponse();

    const result = await runValidations(updateProjectValidation, req, res);

    expect(result.isEmpty()).toBe(true);
  });

  test('should fail when status is invalid', async () => {
    const req = createMockRequest({
      status: 'invalid-status',
    });
    const res = createMockResponse();

    const result = await runValidations(updateProjectValidation, req, res);

    expect(result.isEmpty()).toBe(false);
    const errors = result.array();
    expect(errors.some((e: any) => e.path === 'status')).toBe(true);
  });

  test('should fail when name is empty string', async () => {
    const req = createMockRequest({
      name: '',
    });
    const res = createMockResponse();

    const result = await runValidations(updateProjectValidation, req, res);

    expect(result.isEmpty()).toBe(false);
    const errors = result.array();
    expect(errors.some((e: any) => e.path === 'name')).toBe(true);
  });

  test('should pass when endDate is provided for completed status', async () => {
    const req = createMockRequest({
      status: 'completed',
      endDate: '2025-12-31T00:00:00.000Z',
    });
    const res = createMockResponse();

    const result = await runValidations(updateProjectValidation, req, res);

    expect(result.isEmpty()).toBe(true);
  });
});

