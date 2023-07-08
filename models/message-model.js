const pool = require("../database/")

/* ***************************
 *  Send new Message
 * ************************** */
async function sendMessage(
    message_to,
    message_from,
    message_subject,
    message_body) {

        try {
            const sql = "INSERT INTO message (message_to, message_from, message_subject, message_body)" +
            " VALUES ($1, $2, $3, $4) RETURNING *"
            return await pool.query(sql, [
                message_to,
                message_from,
                message_subject,
                message_body])
        } catch (error) {
            return error.message
        }
}



/* ***************************
 *  get unarchived messages
 * ************************** */
async function getUnarchived(
    message_to) {
        try {
            const sql = "SELECT account_firstname, account_lastname, message_from, message_to, message_created, message_read, message_body, message_subject, message_id FROM message m FULL JOIN account a ON m.message_from = a.account_id WHERE message_to = $1 AND message_archived = false"
            return await pool.query(sql, [
                message_to])
        } catch (error) {
            return error.message
        }
}

/* ***************************
 *  get archived messages
 * ************************** */
async function getArchived(
    message_to) {
        try {
            const sql = "SELECT a.account_firstname, account_lastname, message_from, message_to, message_created, message_read, message_body, message_subject FROM message m FULL JOIN account a ON m.message_from = a.account_id WHERE message_to = $1 AND message_archived = true"
            return await pool.query(sql, [
                message_to])
        } catch (error) {
            return error.message
        }
}
/* ***************************
 *  get message by Id
 * ************************** */
async function getMessageById(message_id) {
    try {
        const data = await pool.query(
            "SELECT * FROM public.message WHERE message_id = $1", 
            [message_id]
            )
            return data.rows[0]
    } catch (error) {
        return new Error("no matching message found")
    }
}

/* ***************************
 *  Mark Message as Read
 * ************************** */
async function markMessageRead(message_id) {
    try {
        const sql = "UPDATE public.message SET message_read = true WHERE message_id = $1"
        return await pool.query(sql, [message_id])
    } catch (error) {
        return error.message
    }
}

/* ***************************
 *  Archive Message
 * ************************** */
async function archiveMessage(message_id) {
    try {
        const sql = "UPDATE public.message SET message_archived = true WHERE message_id = $1"
        return await pool.query(sql, [message_id])
    } catch (error) {
        return error.message
    }
}

/* ***************************
 *  Delete Message
 * ************************** */
async function deleteMessage(message_id) {
    try {
        const sql = "DELETE FROM public.message WHERE message_id = $1"
        return await pool.query(sql, [message_id])
    } catch (error) {
        return error.message
    }
}

module.exports = { sendMessage
                 , getUnarchived
                 , getArchived
                 , getMessageById
                 , markMessageRead
                 , archiveMessage
                 , deleteMessage
                 }