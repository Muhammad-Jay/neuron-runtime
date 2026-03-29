import { Router } from 'express';
import * as SecretsController from '../controllers/vault.controllers';
import {authenticate} from "../middleware/supabaseAuth";

const router = Router();

// Used by the Vault UI
router.get('/', SecretsController.listSecrets);
router.post('/', authenticate, SecretsController.createSecret);
router.delete('/delete/:id', authenticate, SecretsController.deleteSecret);

// Used by the Workflow Engine during execution
router.get('/:id', authenticate, SecretsController.getDecryptedSecret);

export default router;