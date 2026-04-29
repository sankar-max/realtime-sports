import {
  pgTable,
  uuid,
  varchar,
  integer,
  timestamp,
  pgEnum,
  jsonb,
  text,
  index,
} from "drizzle-orm/pg-core";

/**
 * ENUMS
 */
export const matchStatusEnum = pgEnum("match_status", [
  "scheduled",
  "live",
  "finished",
]);

/**
 * MATCHES TABLE
 */
export const matches = pgTable(
  "matches",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    sport: text("sport").notNull(),

    homeTeam: varchar("home_team", { length: 255 }).notNull(),
    awayTeam: varchar("away_team", { length: 255 }).notNull(),

    status: matchStatusEnum("status").notNull().default("scheduled"),

    startTime: timestamp("start_time", { withTimezone: true }).notNull(),
    endTime: timestamp("end_time", { withTimezone: true }),

    homeScore: integer("home_score").notNull().default(0),
    awayScore: integer("away_score").notNull().default(0),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("matches_status_idx").on(t.status),
    index("matches_start_time_idx").on(t.startTime),
  ],
);

/**
 * COMMENTS TABLE
 */
export const comments = pgTable(
  "comments",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    matchId: uuid("match_id")
      .notNull()
      .references(() => matches.id, { onDelete: "cascade" }),
    minute: integer("minute").notNull(),
    userId: varchar("user_id", { length: 255 }).notNull(),
    sequence: integer("sequence"),
    period: varchar("period", { length: 255 }),
    event_type: varchar("event_type", { length: 255 }),
    message: text("message").notNull(),
    team: text("team").notNull(),
    player: text("player").notNull(),
    metadata: jsonb("metadata").$type<Record<string, unknown>>(),

    tags: text("tags").array().default([]),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("comments_match_id_idx").on(t.matchId),
    index("comments_user_id_idx").on(t.userId),
    index("comments_created_at_idx").on(t.createdAt),
  ],
);
