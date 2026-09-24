describe('App Core Flow', () => {
  it('Visits the app root url and checks layout', () => {
    cy.visit('/')
    cy.contains('h1', '自动化工作流任务飞行指挥平台')
    cy.get('.sidebar').should('be.visible')
  })

  it('Navigates to config page and saves config', () => {
    cy.visit('/config')
    cy.contains('.card-header', '接入配置')
    cy.get('input[placeholder="请输入完整的 POST 地址 (包含 https:// 和路径)"]').type(
      'http://localhost:3000/proxy'
    )
    cy.get('input[placeholder="请输入认证秘钥"]').type('test-token')
    cy.get('input[placeholder="请输入项目ID"]').type('test-project')
    cy.get('input[placeholder="请输入工作流ID"]').type('test-workflow')
    cy.get('input[placeholder="请输入创建人ID"]').type('test-creator')
    cy.contains('button', '保存配置').click()
    cy.get('.el-message--success').should('be.visible').contains('配置保存成功')
  })
})
