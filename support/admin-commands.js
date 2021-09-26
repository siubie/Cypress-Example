Cypress.Commands.add("doLogin", function (credentials) {
    cy.visit("http://localhost:8000");
    cy.contains("Create Account").should("be.visible");
    cy.contains("Forgot Password").should("be.visible");
    cy.get(":nth-child(3) > .form-control").type(credentials.email);
    cy.get(":nth-child(4) > .form-control").type(credentials.password);
    cy.get("#kt_login_singin_form_submit_button").click();
    cy.get("#kt_quick_user_toggle").click();
    cy.contains("Profil Pengguna").should("be.visible");
    cy.contains(credentials.email).should("be.visible");
    cy.get("#kt_quick_user_close").click();
});
