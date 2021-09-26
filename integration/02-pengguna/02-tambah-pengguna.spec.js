describe("Uji Fitur Tambah Pengguna", function () {
    it.only("Halaman Tambah Pengguna Sesuai Spek", function () {
        cy.visit("/users/create");
        cy.get(".card-title").contains("Tambah Pengguna");
    });
});
