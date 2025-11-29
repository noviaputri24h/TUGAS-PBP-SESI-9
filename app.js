const express = require("express");
const perpus = require("./perpus");
const app = express();

app.get("/buku", (req, res) => {
  perpus.query("SELECT * FROM buku", (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

app.listen(3000, () => console.log("Server berjalan di port 3000"));


// GET /buku
app.get("/buku", (req, res) => {
    perpus.execute("SELECT * FROM buku", (err, results) => {
        if (err) return res.json({ error: err.message });
        res.json(results);
    });
});

// GET /buku/:id
app.get("/buku/:id", (req, res) => {
    const id = req.params.id;

    perpus.execute("SELECT * FROM buku WHERE id = ?", [id], (err, results) => {
        if (err) return res.json({ error: err.message });

        if (results.length === 0)
            return res.status(404).json({ message: "Buku tidak ditemukan" });

        res.json(results[0]);
    });
});

// POST /buku
app.post("/buku", (req, res) => {
    const { judul, penulis, tahun } = req.body;

    if (!judul || !penulis || !tahun || isNaN(tahun)) {
        return res.status(400).json({ message: "Input tidak valid" });
    }

    perpus.execute(
        "INSERT INTO buku (judul, penulis, tahun) VALUES (?, ?, ?)",
        [judul, penulis, tahun],
        (err, result) => {
            if (err) return res.json({ error: err.message });
            res.json({ message: "Buku berhasil ditambahkan" });
        }
    );
});

// PUT /buku/:id
app.put("/buku/:id", (req, res) => {
    const id = req.params.id;
    const { judul, penulis, tahun } = req.body;

    if (!judul || !penulis || !tahun) {
        return res.status(400).json({ message: "Input tidak boleh kosong" });
    }

    perpus.execute(
        "UPDATE buku SET judul=?, penulis=?, tahun=? WHERE id=?",
        [judul, penulis, tahun, id],
        (err, result) => {
            if (err) return res.json({ error: err.message });

            if (result.affectedRows === 0)
                return res.status(404).json({ message: "Buku tidak ditemukan" });

            res.json({ message: "Buku berhasil diperbarui" });
        }
    );
});

// DELETE /buku/:id
app.delete("/buku/:id", (req, res) => {
    const id = req.params.id;

    perpus.execute("DELETE FROM buku WHERE id=?", [id], (err, result) => {
        if (err) return res.json({ error: err.message });

        if (result.affectedRows === 0)
            return res.status(404).json({ message: "Buku tidak ditemukan" });

        res.json({ message: "Buku berhasil dihapus" });
    });
});
