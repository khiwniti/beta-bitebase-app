interface EnvHelper {
  (key: string, defaultValue?: any): string;
  int(key: string, defaultValue?: number): number;
  bool(key: string, defaultValue?: boolean): boolean;
  array(key: string, defaultValue?: string[]): string[];
}

export default ({ env }: { env: EnvHelper }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1338),
  app: {
    keys: env.array('APP_KEYS'),
  },
  webhooks: {
    populateRelations: env.bool('WEBHOOKS_POPULATE_RELATIONS', false),
  },
  admin: {
    auth: {
      secret: env('ADMIN_JWT_SECRET'),
    },
  },
  jwt: {
    secret: env('JWT_SECRET'),
  },
});
