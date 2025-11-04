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

export const WsMessage = z.discriminatedUnion('type', [
  z.object({ type: z.literal('HELLO'), version: z.string() }),
  z.object({ type: z.literal('STATE'), simTime: z.number(), running: z.boolean() }),
  z.object({ type: z.literal('ENTITY_MOVE'), id: z.string(), from: z.string(), to: z.string(), at: z.number() }),
  z.object({ type: z.literal('METRIC'), series: z.array(z.object({ name: z.string(), t: z.number(), v: z.number() })) }),
  z.object({ type: z.literal('LOG'), level: z.string(), msg: z.string(), at: z.number() }),
  z.object({ type: z.literal('ERROR'), msg: z.string() })
]);

export const ClientCommand = z.discriminatedUnion('cmd', [
  z.object({ cmd: z.literal('LOAD_MODEL'), model: ModelSchema }),
  z.object({ cmd: z.literal('START') }),
  z.object({ cmd: z.literal('PAUSE') }),
  z.object({ cmd: z.literal('RESET') }),
  z.object({ cmd: z.literal('SET_PARAM'), id: z.string(), key: z.string(), value: z.any() })
]);
