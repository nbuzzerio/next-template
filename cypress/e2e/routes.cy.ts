import "@testing-library/cypress"

describe("Navbar", (() => {
    it("displays the login page when clicking sign-in button", () => {
        cy.visit('/')
        cy.findByText(/sign in/i).click()
        cy.findByRole('heading', {name: /log in template/i}).should('exist')
    })

}))