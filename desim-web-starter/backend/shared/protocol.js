import { z } from 'zod';

export const DistributionSchema = z.union([
  z.number(),
  z.object({ dist: z.object({
    type: z.enum(['Uniform','Exponential','Triangular']),
    min: z.number().optional(),
    max: z.number().optional(),
    mean: z.number().optional(),
    mode: z.number().optional()
  })}),
  z.object({ expr: z.string() })
]);

export const ObjectSchema = z.object({
  type: z.enum([
    'EntityGenerator','Queue','Server','Resource','EntitySink','Branch',
    'Statistics','TimeSeries','SubModel'
  ]),
  inputs: z.record(z.any()).default({}),
  groups: z.array(z.string()).optional()
});

export const ModelSchema = z.object({
  include: z.array(z.string()).optional(),
  define: z.record(ObjectSchema),
  links: z.array(z.object({ from: z.string(), to: z.string() })).default([]),
  globals: z.object({
    units: z.object({ time: z.string().default('s'), length: z.string().default('m') }).optional()
  }).default({})
});

