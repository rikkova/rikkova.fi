# rikkova.fi — Väinö Rikkonen, Infrastructure & Network Architect

Source for [rikkova.fi](https://rikkova.fi), the professional portfolio of Väinö Rikkonen: infrastructure and network architect in Helsinki, Finland. 8+ years across hyperscale operations (Google), enterprise datacenter transformation (CGI), and cyber defense (Accenture).

## What the site covers

- **Network architecture** — BGP, OSPF, VXLAN-EVPN, MPLS, DWDM inter-DC transport, IPv4/IPv6 dual-stack, hybrid cloud connectivity (AWS Direct Connect, Azure ExpressRoute)
- **Platform & compute** — Nutanix HCI design and migration, datacenter decommissioning and consolidation, capacity planning
- **Automation & Zero Trust** — Ansible/Python infrastructure as code, SASE/Zero Trust access architecture
- **Observability** — TIG-stack telemetry, BGP monitoring via BMP (RFC 7854), NetFlow at the internet edge
- **Case studies** — [VXLAN-EVPN fabric migration](https://rikkova.fi/work/vxlan-evpn-migration.html), [SASE/Zero Trust migration for ~4,000 users](https://rikkova.fi/work/sase-zero-trust-migration.html)

## Stack

Static site: HTML, CSS (custom design tokens, fluid type), vanilla JS with GSAP scroll animations. Deployed on Cloudflare (Wrangler). No framework, no build step.

## Structure

```
index.html          Single-page portfolio
work/               Case study pages
css/style.css       Design tokens + all styles
js/main.js          Theme toggle, mobile nav, scroll reveal
robots.txt          Crawl config
sitemap.xml         Index of pages
```

## Contact

- [rikkova.fi](https://rikkova.fi)
- [linkedin.com/in/rikkova](https://www.linkedin.com/in/rikkova)
- [vaino.rikkonen@gmail.com](mailto:vaino.rikkonen@gmail.com)
