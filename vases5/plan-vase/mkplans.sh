#!/bin/sh
# lab/plans73.html: the QA page (mkqa.sh) plus vases5/plan-vase/plans73.js (the plan of every vessel of the catalogue)
cd "$(dirname "$0")/../.."
sed 's#</script></body></html>#;\n#' lab/qa13.html > lab/plans73.html && cat vases5/plan-vase/plans73.js >> lab/plans73.html && echo '</script></body></html>' >> lab/plans73.html
tail -c 200 lab/plans73.html | head -c 0; echo ok
