import { Request, Response } from 'express';
import { TemplateService } from '../services/template.service';

export class TemplateController {
  public static getTemplates(_req: Request, res: Response): void {
    const templates = TemplateService.getTemplates();
    res.status(200).json(templates);
  }

  public static getTemplateById(req: Request, res: Response): void {
    const { id } = req.params;
    const template = TemplateService.getTemplateById(id);
    if (!template) {
      res.status(404).json({ error: `Template with ID '${id}' not found` });
      return;
    }
    res.status(200).json(template);
  }

  public static getFonts(_req: Request, res: Response): void {
    const fonts = TemplateService.getAvailableFonts();
    res.status(200).json(fonts);
  }
}
