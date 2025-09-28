// Backend/controllers/quoteController.js
const db = require("../config/db");
const { getIO } = require("../socket");

// Add New Quote
const addQuote = async (req, res) => {
  const { quote, author, book } = req.body;

  if (!quote || !author) {
    return res.status(400).json({ message: "Quote and author are required." });
  }

  try {
    const [result] = await db.execute(
      "INSERT INTO add_quotes (quote, author, book) VALUES (?, ?, ?)",
      [quote, author, book]
    );

    const newQuote = {
      id: result.insertId,
      text: quote,
      author,
      book,
    };

    // ✅ Emit the new quote to all connected clients
    const io = getIO();
    io.emit("newQuote", newQuote);

    res.status(201).json({ message: "Quote added successfully", id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Get All Quotes
const getQuotes = async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM add_quotes ORDER BY id DESC");

    // Transform MySQL fields to match frontend expectations
    const formattedQuotes = rows.map((q) => ({
      id: q.id,
      text: q.quote,   // 💡 Mapping 'quote' ➜ 'text'
      author: q.author,
      book: q.book,
    }));

    res.json(formattedQuotes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a quote by ID
const deleteQuote = async (req, res) => {
  console.log("DELETE /api/quotes/:id called with id", req.params.id);
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Quote ID is required." });
  }

  try {
    // Delete the quote from the database
    const [result] = await db.execute("DELETE FROM add_quotes WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Quote not found." });
    }

    // Optional: emit a 'quoteDeleted' event to sockets if needed
    // const io = getIO();
    // io.emit("quoteDeleted", parseInt(id));

    res.status(200).json({ message: "Quote deleted successfully." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


module.exports = { addQuote, getQuotes, deleteQuote };
