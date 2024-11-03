import { Command } from 'commander';
import { wrapContext } from './context';
import { cloneAction } from './commands/clone';

const program = new Command();

program.name('hello dux');

program
  .command('clone')
  .argument('[name]', 'template name')
  .argument('[directory]', 'the template where clone')
  .argument('--list', 'list all template name and description')
  .action(wrapContext('clone', cloneAction));
