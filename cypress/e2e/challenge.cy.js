describe('Hacker News Search', () => {
  const faker = require('faker')
  const randomWord = faker.random.word()
  const term = 'cypress.io'
  let count = 0

  beforeEach(() => {
    cy.intercept(`**/search?query=${randomWord}&page=0&hitsPerPage=100`).as(
      'random'
    )

    cy.intercept(
      'GET',
      `**/search?query=${term}&page=0&hitsPerPage=100`,
      () => {
        count += 1
      }
    ).as('getTerm')

    cy.visit('https://hackernews-seven.vercel.app/')
  })
  it('testing search cache', () => {
    cy.search(term)
    cy.wait('@getTerm')

    cy.search(randomWord)
    cy.wait('@random')

    cy.search(term).then(() => {
      expect(count, `network calls to fetch ${randomWord}`).to.equal(1)
    })
  })
})
