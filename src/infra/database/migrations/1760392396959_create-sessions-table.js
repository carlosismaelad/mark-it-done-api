export const up = (pgm) => {
  pgm.createTable("sessions", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },
    token: {
      type: "varchar(96)",
      notNull: true,
      unique: true,
    },
    user_id: {
      type: "uuid",
      notNull: true,
    },
    expires_at: {
      type: "timestamptz",
      notNull: true,
    },
    created_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("timezone('utc', now())"),
    },
    updated_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("timezone('utc', now())"),
    },
    code: {
      type: "varchar(6)",
      notNull: true,
    },
    attempts: {
      type: "integer",
      notNull: true,
      default: 0,
    },
    code_expires_at: {
      type: "timestamptz",
      notNull: true,
    },
    status: {
      type: "varchar(20)",
      notNull: true,
      default: "pending",
    },
  });
};

export const down = false;
