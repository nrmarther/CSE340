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
 *  get unread messages
 * ************************** */
async function getUnread(
    message_to) {
        try {
            const sql = "SELECT * FROM message WHERE message_to = $1 AND message_read = false"
            return await pool.query(sql, [
                message_to])
        } catch (error) {
            return error.message
        }
}

module.exports = { sendMessage
                 , getUnread
                 }