export const up = pgm => {
  pgm.createTable("items", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },
    name: {
      type: "varchar(60)",
      notNull: true,
    },
    mark: {
      type: "varchar(60)",
      notNull: false,
    },
    unit_price: {
      type: "numeric(10, 2)",
      notNull: false,
    },
    quantity: {
      type: "numeric(10, 2)",
      notNull: false,
    },
    list_id: {
      type: "uuid",
      notNull: false,
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
  });
};

export const down = false;
