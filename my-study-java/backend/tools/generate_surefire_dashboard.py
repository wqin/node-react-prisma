#!/usr/bin/env python3
"""Generate a single-page HTML dashboard from Surefire XML reports.

Place this script at the repository root and run it. It reads
backend/target/surefire-reports/TEST-*.xml and writes
backend/target/site/surefire-dashboard.html with embedded data.
"""
import xml.etree.ElementTree as ET
import glob
import json
import os
import html

REPORT_GLOB = 'backend/target/surefire-reports/TEST-*.xml'
OUT_DIR = 'backend/target/site'
OUT_FILE = os.path.join(OUT_DIR, 'surefire-dashboard.html')


def parse_reports():
    files = sorted(glob.glob(REPORT_GLOB))
    if not files:
        print('No surefire XML reports found in', REPORT_GLOB)
        return None

    summary = {'tests': 0, 'failures': 0, 'errors': 0, 'skipped': 0, 'time': 0.0}
    entries = []

    for fpath in files:
        try:
            tree = ET.parse(fpath)
        except Exception as e:
            print('Failed to parse', fpath, e)
            continue
        root = tree.getroot()
        suites = []
        if root.tag == 'testsuites':
            suites = root.findall('testsuite')
        else:
            suites = [root]

        for s in suites:
            summary['tests'] += int(s.attrib.get('tests', 0))
            summary['failures'] += int(s.attrib.get('failures', 0))
            summary['errors'] += int(s.attrib.get('errors', 0))
            summary['skipped'] += int(s.attrib.get('skipped', s.attrib.get('disabled', 0)))
            summary['time'] += float(s.attrib.get('time', 0.0))

            for case in s.findall('testcase'):
                classname = case.attrib.get('classname', '')
                name = case.attrib.get('name', '')
                time = case.attrib.get('time', '')
                status = 'passed'
                details = ''
                if case.find('failure') is not None:
                    status = 'failure'
                    details = case.find('failure').text or ''
                elif case.find('error') is not None:
                    status = 'error'
                    details = case.find('error').text or ''
                elif case.find('skipped') is not None:
                    status = 'skipped'

                entries.append({
                    'class': classname,
                    'name': name,
                    'time': time,
                    'status': status,
                    'details': details,
                })

    return {'summary': summary, 'tests': entries}


def render_html(data):
    payload = json.dumps(data)
    safe_payload = html.escape(payload)
    html_template = """
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Surefire Test Dashboard</title>
  <style>
    body{font-family:Segoe UI,Roboto,Arial;margin:18px}
    .summary{display:flex;gap:16px;margin-bottom:12px}
    .card{padding:12px;border-radius:6px;background:#f6f7fb}
    .passed{color:green}.failure{color:#b00020}.error{color:#7a0023}
    table{width:100%;border-collapse:collapse}
    th,td{padding:8px;border-bottom:1px solid #eee;text-align:left}
    tr:hover{background:#fafafa}
    .details{display:none;background:#fff6f6;padding:10px;border:1px solid #f2dede;margin-top:6px;white-space:pre-wrap;font-family:monospace}
    .filter{margin:8px 0}
    .btn{cursor:pointer;padding:6px 8px;border-radius:4px;border:1px solid #ccc;background:#fff}
  </style>
</head>
<body>
  <h2>Surefire Test Dashboard</h2>
  <div id="root"></div>

  <script>
    const DATA = JSON.parse("{SAFE_PAYLOAD}");

    function render(){
      const s = DATA.summary;
      const tests = DATA.tests;
      const root = document.getElementById('root');
      root.innerHTML = '';

      const sum = document.createElement('div'); sum.className='summary';
      sum.innerHTML = `<div class="card"><strong>Total</strong><div>${s.tests}</div></div>`+
                      `<div class="card"><strong>Passed</strong><div>${s.tests - s.failures - s.errors - s.skipped}</div></div>`+
                      `<div class="card failure"><strong>Failures</strong><div>${s.failures}</div></div>`+
                      `<div class="card error"><strong>Errors</strong><div>${s.errors}</div></div>`+
                      `<div class="card"><strong>Skipped</strong><div>${s.skipped}</div></div>`+
                      `<div class="card"><strong>Time(s)</strong><div>${s.time.toFixed(2)}</div></div>`;
      root.appendChild(sum);

      const ctrl = document.createElement('div'); ctrl.className='filter';
      ctrl.innerHTML = `<input id="q" placeholder="search by class or name" style="width:320px;padding:6px;border:1px solid #ccc;border-radius:4px">`+
                       ` <button class="btn" onclick="applyFilter()">Filter</button>`+
                       ` <button class="btn" onclick="resetFilter()">Reset</button>`;
      root.appendChild(ctrl);

      const tbl = document.createElement('table');
      tbl.innerHTML = `<thead><tr><th>Status</th><th>Class</th><th>Test</th><th>Time(s)</th></tr></thead>`;
      const tbody = document.createElement('tbody');

      tests.forEach((t, idx)=>{
        const tr = document.createElement('tr');
        tr.innerHTML = `<td class="${t.status}">${t.status}</td>`+
                       `<td>${t.class}</td>`+
                       `<td><a href="#" onclick="toggleDetails(${idx});return false">${t.name}</a>`+
                       `<div id="d${idx}" class="details">${escapeHtml(t.details)}</div></td>`+
                       `<td>${t.time}</td>`;
        tbody.appendChild(tr);
      });

      tbl.appendChild(tbody);
      root.appendChild(tbl);

      window.applyFilter = function(){
        const q = document.getElementById('q').value.toLowerCase();
        Array.from(tbody.children).forEach((tr)=>{
          tr.style.display = (q === '' || tr.textContent.toLowerCase().includes(q)) ? '' : 'none';
        });
      }
      window.resetFilter = function(){document.getElementById('q').value=''; applyFilter();}
      window.toggleDetails = function(i){
        const el = document.getElementById('d'+i);
        if(!el) return; el.style.display = (el.style.display==='none' || el.style.display==='') ? 'block' : 'none';
      }

      function escapeHtml(s){ if(!s) return ''; return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
    }

    render();
  </script>
</body>
</html>
"""
    html_content = html_template.replace('{SAFE_PAYLOAD}', safe_payload)
    return html_content


def main():
    data = parse_reports()
    if data is None:
        return 2
    outdir = OUT_DIR
    os.makedirs(outdir, exist_ok=True)
    with open(OUT_FILE, 'w', encoding='utf-8') as f:
        f.write(render_html(data))
    print('Dashboard written to', OUT_FILE)
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
