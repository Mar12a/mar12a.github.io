"""Package only the current portfolio, excluding local design experiments."""
from pathlib import Path
import json,shutil
ROOT=Path(__file__).resolve().parents[1]
SOURCE=ROOT/'public'
OUTPUT=ROOT/'_site'
files=['index.html','kaleido.html','about.html','portfolio.html','scripts/artwork-data.js','scripts/site.js','scripts/kaleido.js','scripts/about.js','scripts/language.js','styles/fonts.css','styles/kaleido.css','styles/about.css','assets/favicon.svg','assets/name-writing.png','assets/name-writing.mp4','assets/cutout-comet.webp']
artworks=json.loads((SOURCE/'scripts/artwork-data.js').read_text().split('=',1)[1].strip().rstrip(';'))
files += ['assets/'+a['id']+'.webp' for a in artworks]
files += ['assets/mara'+str(i)+'.webp' for i in range(1,10)]
files += ['assets/font-'+str(i)+'.ttf' for i in range(8)]
files += [str(p.relative_to(SOURCE)) for p in (SOURCE/'assets/font-licenses').glob('*.txt')]
missing=[p for p in files if not (SOURCE/p).is_file()]
if missing:raise SystemExit('Missing files: '+', '.join(missing))
if OUTPUT.exists():shutil.rmtree(OUTPUT)
for name in files:
 target=OUTPUT/name;target.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(SOURCE/name,target)
(OUTPUT/'.nojekyll').touch()
print(f'Packaged {len(files)} files into _site; original assets and experiments excluded.')
