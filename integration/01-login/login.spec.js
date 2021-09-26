/// <reference types="Cypress" />

describe("Login", function () {
    beforeEach(function () {
        cy.fixture("admin").then(function (admin) {
            this.admin = admin;
            cy.visit("/");
        });
    });

    describe("Login Sukses", function () {
        it("Login Dengan Username dan Password Benar", function () {
            cy.get(":nth-child(3) > .form-control").type(this.admin.email);
            cy.get(":nth-child(4) > .form-control").type(this.admin.password);
            cy.get("#kt_login_singin_form_submit_button").click();
            cy.get("#kt_quick_user_toggle").click();
            cy.contains("Profil Pengguna").should("be.visible");
            cy.contains("admin@gmail.com").should("be.visible");
        });
    });

    describe("Login Gagal", function () {
        it("Email tidak valid", function () {
            cy.get(":nth-child(3) > .form-control").type(this.admin.wrongEmail);
            cy.get(":nth-child(4) > .form-control").type(
                this.admin.wrongPassword
            );
            cy.get("#kt_login_singin_form_submit_button").click();
            cy.contains("These credentials").should("be.visible");
        });
        it("Email Kosong", function () {
            cy.get(":nth-child(4) > .form-control").type(
                this.admin.wrongPassword
            );
            cy.get("#kt_login_singin_form_submit_button").click();
            cy.contains("The email").should("be.visible");
        });
        it("password kosong", function () {
            cy.get(":nth-child(3) > .form-control").type(this.admin.email);
            cy.get("#kt_login_singin_form_submit_button").click();
            cy.contains("The password").should("be.visible");
        });
    });
});
