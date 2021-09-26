/// <reference types="Cypress" />

describe("Cek List Pengguna", function () {
    beforeEach(function () {
        cy.fixture("admin").then(function (admin) {
            this.admin = admin;
            cy.doLogin(this.admin);
        });
    });

    it("Halaman List Pengguna Sesuai Spek", function () {
        cy.get("a").contains("Manajemen Pengguna").click();
        cy.get("a").contains("List Pengguna").click();
        cy.get("h5").contains("Manajemen Pengguna").should("be.visible");
        cy.get(".btn")
            .contains("Tambah")
            .should("have.class", "btn-light-primary");
        cy.get(".btn").contains("Filter").should("have.class", "btn-primary");
        cy.get(".btn").contains("Reset").should("have.class", "btn-secondary");
        cy.get(".btn")
            .contains("Import Excel")
            .should("have.class", "btn-primary");
        cy.get(".btn")
            .contains("Export Excel")
            .should("have.class", "btn-light-primary");
        cy.get("#datatables_info").should(
            "contain.text",
            "Showing 1 to 2 of 2 entries"
        );
        cy.get(".pagination > .active").should("contain.text", "1");
        cy.get("#datatables > tbody").find("tr").should("have.length", 2);
        cy.get(".custom-select").select("25");
        cy.get("#datatables_info").should(
            "contain.text",
            "Showing 1 to 2 of 2 entries"
        );
        cy.get("#datatables > tbody").find("tr").should("have.length", 2);
        cy.get(".deleteButton").should("have.length", 2);
        cy.get(".deleteButton").prev().should("have.length", 2);
        cy.get(".deleteButton").prev().prev().should("have.length", 2);
    });
    it("Bisa Navigate ke Tambah Pengguna", function () {
        cy.get("a").contains("Manajemen Pengguna").click();
        cy.get("a").contains("List Pengguna").click();
        cy.get("h5").contains("Manajemen Pengguna").should("be.visible");
        cy.get(".btn")
            .contains("Tambah")
            .should("have.class", "btn-light-primary")
            .click();
        cy.url().should("include", "/users/create");
    });

    it("Filter hak akses berjalan dengan baik", function () {
        //buka halaman list
        cy.get("a").contains("Manajemen Pengguna").click();
        cy.get("a").contains("List Pengguna").click();
        cy.get("h5").contains("Manajemen Pengguna").should("be.visible");
        cy.get(".btn").contains("Filter").should("have.class", "btn-primary");
        //tes filter pake role admin
        cy.get("#role").select("admin", { force: true });
        //change value dropdown
        cy.get(".btn").contains("Filter").should("have.class", "btn-primary");
        //klik button filter
        cy.intercept({
            method: "POST",
            url: "users/data/filter",
        }).as("dataFilterAdmin");
        cy.get(".btn").contains("Filter").click();
        cy.wait("@dataFilterAdmin");
        //assert hasil filter
        let values = [];
        cy.get("#datatables")
            .find("tr.odd:nth-child(1) td")
            .each(($el, $index) => {
                cy.wrap($el)
                    .invoke("text")
                    .then((text) => {
                        cy.log(text);
                        values.push(text.trim());
                    });
            })
            .then(() =>
                expect(values).to.deep.eq([
                    "admin",
                    "admin@gmail.com",
                    "admin",
                    "",
                ])
            );
        //tes pake role peserta
        cy.get("#role").select("peserta", { force: true });
        //change value dropdown
        cy.get(".btn").contains("Filter").should("have.class", "btn-primary");
        //klik button filter
        cy.intercept({
            method: "POST",
            url: "users/data/filter",
        }).as("dataFilterPeserta");
        cy.get(".btn").contains("Filter").click();
        //assert hasil filter
        cy.wait("@dataFilterPeserta");

        let checkPeserta = [];
        cy.get("#datatables")
            .find("tr.odd:nth-child(1) td")
            .each(($el, $index) => {
                cy.wrap($el)
                    .invoke("text")
                    .then((text) => {
                        cy.log(text);
                        checkPeserta.push(text.trim());
                    });
            })
            .then(() =>
                expect(checkPeserta).to.deep.eq([
                    "peserta",
                    "peserta@gmail.com",
                    "peserta",
                    "",
                ])
            );
    });
    it("Reset di filter hak akses berjalan dengan baik", function () {
        //buka halaman lagi
        cy.get("a").contains("Manajemen Pengguna").click();
        cy.get("a").contains("List Pengguna").click();
        cy.get("h5").contains("Manajemen Pengguna").should("be.visible");
        cy.get(".btn").contains("Filter").should("have.class", "btn-primary");
        //tes filter pake role admin
        cy.get("#role").select("admin", { force: true });
        //change value dropdown
        cy.get(".btn").contains("Filter").should("have.class", "btn-primary");
        //klik button filter
        cy.intercept({
            method: "POST",
            url: "users/data/filter",
        }).as("dataFilterAdmin");
        cy.get(".btn").contains("Filter").click();
        cy.wait("@dataFilterAdmin");
        //assert hasil filter
        let values = [];
        cy.get("#datatables")
            .find("tr.odd:nth-child(1) td")
            .each(($el, $index) => {
                cy.wrap($el)
                    .invoke("text")
                    .then((text) => {
                        cy.log(text);
                        values.push(text.trim());
                    });
            })
            .then(() =>
                expect(values).to.deep.eq([
                    "admin",
                    "admin@gmail.com",
                    "admin",
                    "",
                ])
            );
        //klik reset
        cy.get(".btn")
            .contains("Reset")
            .should("have.class", "btn-secondary")
            .click();
        cy.wait("@dataFilterAdmin");
        //pastikan hasilnya sesuai expected reset
        let firstRow = [];
        cy.get("#datatables")
            .find("tr.odd:nth-child(1) td")
            .each(($el, $index) => {
                cy.wrap($el)
                    .invoke("text")
                    .then((text) => {
                        cy.log(text);
                        firstRow.push(text.trim());
                    });
            })
            .then(() =>
                expect(firstRow).to.deep.eq([
                    "admin",
                    "admin@gmail.com",
                    "admin",
                    "",
                ])
            );
        let secondRow = [];
        cy.get("#datatables")
            .find("tr.even:nth-child(2) td")
            .each(($el, $index) => {
                cy.wrap($el)
                    .invoke("text")
                    .then((text) => {
                        cy.log(text);
                        secondRow.push(text.trim());
                    });
            })
            .then(() =>
                expect(secondRow).to.deep.eq([
                    "peserta",
                    "peserta@gmail.com",
                    "peserta",
                    "",
                ])
            );
    });

    it.skip("Export excel berhasil download file dengan benar", function () {
        cy.get("a").contains("Manajemen Pengguna").click();
        cy.get("a").contains("List Pengguna").click();
        cy.get("h5").contains("Manajemen Pengguna").should("be.visible");
        cy.get(".btn")
            .contains("Export Excel")
            .should("have.class", "btn-light-primary")
            .click();
    });
    it.only("Import excel berhasil import data dengan benar", function () {
        cy.get("a").contains("Manajemen Pengguna").click();
        cy.get("a").contains("List Pengguna").click();
        cy.get("h5").contains("Manajemen Pengguna").should("be.visible");
        cy.get(".btn").contains("Filter").should("have.class", "btn-primary");

        const filepath = "dataExcel.xlsx";
        cy.get('input[type="file"]').attachFile(filepath);
        cy.get(".btn-primary").contains("Import Excel").click();
    });
});
