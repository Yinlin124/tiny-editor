import type FluentEditor from '../../fluent-editor'

export default class Ai {
  private popup: HTMLDivElement;

  constructor(public quill: FluentEditor) {
    this.quill = quill;
    this.popup = this.createPopup();
    this.registerHandler();
  }

  private createPopup(): HTMLDivElement {
    const popup = document.createElement('div');
    popup.className = 'ql-ai-popup';
    popup.style.display = 'none';
    popup.innerHTML = `
      <div class="ql-ai-header">
        ${this.quill.getLangText('aiAssistant')}
        <button class="ql-close">×</button>
      </div>
      <div class="ql-ai-content">
          <div class="ql-ai-result"></div>
          <textarea placeholder="${this.quill.getLangText('aiPromptPlaceholder')}"></textarea>
          <div class="ql-ai-buttons">
            <button class="ql-generate">${this.quill.getLangText('generate')}</button>
            <button class="ql-confirm" disabled>${this.quill.getLangText('confirm')}</button>
          </div>
      </div>
    `;
    this.quill.container.appendChild(popup);
    return popup;
  }

  private registerHandler(): void {
    const toolbar = this.quill.getModule('toolbar') as FluentEditorToolbar;
    toolbar.addHandler('ai', () => this.togglePopup());
    
    this.popup.querySelector('.ql-close')?.addEventListener('click', () => {
      this.hidePopup();
    });
    this.popup.querySelector('.ql-generate')?.addEventListener('click', async () => {
      const textarea = this.popup.querySelector('textarea');
      const prompt = textarea?.value.trim();
      
      if (!prompt) {
        alert(this.quill.getLangText('aiPromptRequired'));
        return;
      }

      try {
        const generateBtn = this.popup.querySelector('.ql-generate');
        generateBtn?.setAttribute('disabled', 'true');
        generateBtn!.textContent = this.quill.getLangText('generating');
        
        // TODO: 替换为实际的AI服务调用
        const response = await fetch('http://localhost:11434/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'deepseek-r1:14b',
            prompt,
            stream: false, // 默认是 true，返回流式数据
          })
        });

        console.log('response', response);
        

        if (!response.ok) throw new Error('API请求失败');
        
        const result = await response.json();
        console.log('result', result);
        
        const resultArea = this.popup.querySelector('.ql-ai-result');
        console.log('resultArea:', resultArea);
        console.log('result.response', result.response);
        
        resultArea.innerHTML = result.response;
        this.popup.querySelector('.ql-confirm')?.removeAttribute('disabled');
      } catch (error) {
        console.error('AI生成失败:', error);
        alert(this.quill.getLangText('aiGenerationFailed'));
      } finally {
        const generateBtn = this.popup.querySelector('.ql-generate');
        generateBtn?.removeAttribute('disabled');
        generateBtn!.textContent = this.quill.getLangText('generate');
        this.popup.querySelector('.ql-confirm')?.setAttribute('disabled', 'true');
        this.popup.querySelector('.ql-ai-result')!.innerHTML = '';
      }
    });
  }

  public togglePopup(): void {
    this.popup.style.display = this.popup.style.display === 'none' ? 'block' : 'none';
    this.positionPopup();
  }

  private positionPopup(): void {
    const toolbarHeight = this.quill.container.querySelector('.ql-toolbar')?.clientHeight || 0;
    this.popup.style.top = `${toolbarHeight + 10}px`;
    this.popup.style.right = '10px';
  }

  private hidePopup(): void {
    this.popup.style.display = 'none';
  }
}