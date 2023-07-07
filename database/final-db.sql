CREATE TABLE IF NOT EXISTS public.message(
    message_id integer NOT NULL GENERATED BY DEFAULT AS IDENTITY,
    message_subject character varying NOT NULL,
    message_body text NOT NULL,
    message_created timestamptz NOT NULL GENERATED BY current_timestamp AS TIME
    message_to integer NOT NULL,
    message_from integer NOT NULL
    message_read BOOLEAN NOT NULL DEFAULT false
    message_archived BOOLEAN NOT NULL DEFAULT false
    CONSTRAINT message_pkey PRIMARY KEY (message_id)
)