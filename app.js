/**
 * V-OS Network Terminal v2.0 - Application Logic
 * Author: Väinö Rikkonen
 * 
 * A terminal-based portfolio showcasing network engineering expertise
 * with interactive topology and command-line interface.
 */

(function() {
  'use strict';

  // ============================================
  // Configuration & Constants
  // ============================================

  const CONFIG = {
    bootDelay: 25,
    logoDelay: 45,
    hardwareLogDelay: Math.random() * 80 + 20,
    sshAnimationDuration: 350,
    sshDotsCount: 3,
    sshGapBetweenDots: 350,
    sshTotalDuration: 600,
    uptimeDate: new Date(1997, 8, 17) // September 17, 1997
  };

  const THEMES = {
    default: 'var(--green)',
    amber: '#ffb347',
    cyan: '#00ffff',
    hacker: '#ff0000',
    google: '#4285f4',
    bmw: '#ffffff'
  };

  // ============================================
  // Network Jokes Database
  // ============================================

  const networkJokes = [
    "Network design is the art of choosing where future problems will happen.",
    "Why do network engineers love weekends? Fewer change windows, fewer surprises.",
    "I told the data center a joke. It needed a moment to process.",
    "My favorite routing protocol is coffee. It always finds the shortest path to productivity.",
    "There are only two hard things in networking: naming things, timing maintenance, and BGP.",
    "I would explain spanning tree, but I do not want to create a loop.",
    "There is no greater optimism than writing no impact expected in a change plan.",
    "Somewhere out there, a forgotten static route is still making bold choices.",
    "It is not DNS, it cannot be DNS, it was DNS.",
    "A data center without labeling is just an escape room for engineers.",
    "The outage was not that bad. It only affected everyone.",
    "The packet capture was clean, which was deeply unhelpful.",
    "The route reflector reflected on its choices and still chose chaos.",
    "High availability means having twice as many things to misunderstand.",
    "The issue was resolved once we accepted that the diagram was fiction.",
    "A single typo can turn infrastructure as code into infrastructure as folklore.",
    "Ansible is great because it lets you break everything consistently at scale.",
    "Temporary solutions often become permanent problems.",
    "Nothing says confidence like pushing firewall policy with one eye on the rollback timer.",
    "My favorite optical tool is optimism, followed closely by an actual power meter.",
    "I asked the switch for emotional support. It said the port was administratively down.",
    "The firewall and I have something in common: we both drop things under pressure.",
    "Never trust a quiet rack. It is either perfect or plotting.",
    "Network engineering: turning blinking lights into business continuity.",
    "Nothing ages faster than a network diagram and a temporary workaround.",
    "Every packet has a dream. Some just get filtered before they make it.",
    "The hardware was end-of-life, but apparently not end-of-drama.",
    "The bravest command in networking is reload in 10, and the scariest is forgetting to set it.",
    "Troubleshooting starts with logic and ends with vibes and packet captures.",
    "The maintenance was routine, which is how the interesting incidents always begin.",
    "The final dependency in the migration plan was apparently a handsaw.",
    "Nothing resets the mood on a sev-1 bridge like a client asking whether tonight feels more like wine or beer.",
    "'Losing a few packets' means very different things depending on your profession."
  ];

  const spanningTreeJokeIndex = networkJokes.findIndex(joke => 
    joke === "I would explain spanning tree, but I do not want to create a loop."
  );

  // ============================================
  // Incident Database
  // ============================================

  const incidentDetails = {
    'show incident 1': [
      `<span class="incident-red">INC-2024-09</span>  BGP hierarchy deletion during maintenance`,
      '',
      `  Impact: An engineer targeted a VRF change but deleted the parent router bgp hierarchy in candidate config`,
      `  Effect: Potential loss of global and VRF-level BGP state if committed unchallenged`,
      `  Root cause: Human error in hierarchical CLI editing with insufficient policy guardrails`,
      `  Fix: Aborted change, restored intended subtree, and reviewed diff before retry`,
      `  Prevention: Implemented pre-commit validation to reject destructive parent-level BGP removals`,
      '',
      `<i class="text-dim">Summary sanitized for public display.</i>`
    ],
    'show incident 2': [
      `<span class="incident-red">INC-2024-02</span>  Remote access VPN certificate expiry`,
      '',
      `  Impact: Expired certificate caused remote access VPN authentication failure for active users`,
      `  Effect: Existing sessions dropped and new user connections were rejected until certificate renewal completed`,
      `  Root cause: Certificate renewal was not completed before the service validity window ended`,
      `  Fix: Renewed and deployed the certificate chain, then verified client connectivity and trust state`,
      `  Prevention: Implemented automated certificate renewal and deployment for the remote access VPN`,
      '',
      `<i class="text-dim">Summary sanitized for public display.</i>`
    ],
    'show incident 3': [
      `<span class="incident-yellow">INC-2023-08</span>  Dark fiber path lost during external construction`,
      '',
      `  Impact: Third-party roadwork and piling activity damaged one of two inter-datacenter dark fiber paths`,
      `  Effect: One transport path was lost, but services remained available on the surviving diverse fiber route`,
      `  Root cause: Civil construction intersected the physical path of a leased dark fiber segment near a motorway corridor`,
      `  Fix: Traffic continued over the secondary path while the damaged fiber provider path was repaired`,
      `  Prevention: Designed inter-datacenter transport over two geographically diverse dark fiber paths`,
      '',
      `<i class="text-dim">Summary sanitized for public display.</i>`
    ]
  };

  // ============================================
  // Command Database
  // ============================================

  const commands = {
    'help': `Available commands:
  whoami            - Display profile information
  show architecture - View CI/CD automation & TIG observability stack
  show dwdm         - View active DWDM / 400G DCI transport
  show version      - View system uptime and certifications
  show ip route     - View network architecture scope
  show incidents    - View short incident postmortems
  show bgp sum      - View IT/Network engineering skills
  show interface    - View projects
  show cdp nei      - View languages and soft skills
  show topology     - View interactive topology
  ping              - Display contact details
  traceroute        - Trace career path and job history
  tcpdump           - Capture live traffic
  wget resume       - Download my resume (PDF)
  curl              - Display external IP address information
  history           - Display command history
  top               - Monitor active tasks and current focus
  theme             - Change terminal color (default, amber, cyan, hacker, google, bmw)
  nmap              - Scan active services and protocols
  diagnostics       - Run diagnostics
  joke              - Display a random network/data center joke
  clear             - Clear the terminal screen`,

    'show bgp sum': `=== Routing, Switching & Optical ===
Protocols              : BGP, OSPF, IS-IS, MPLS & Segment Routing, VXLAN, BFD
Cisco OS & Hardware    : IOS-XR/XE, NX-OS, NCS, ASR, Nexus, Catalyst, ISE
Multi-Vendor           : Juniper JunOS, Arista EOS, Nokia SR OS, F5 BIG-IP
Optical Transport      : DWDM, ADVA, Smartoptics

=== Network Security ===
Firewalls & NGFW       : Palo Alto, FortiGate, Checkpoint, Cisco ASA
Architecture           : SASE, Zero Trust, IPSec/SSL VPN, DDoS Mitigation

=== Automation & Telemetry ===
NetDevOps              : Python, Ansible, Terraform, Git
Programmability        : NETCONF, RESTCONF, gNMI, Cisco NSO/NDFC
Observability          : SNMP, NetFlow, Telegraf, InfluxDB, Grafana`,

    'show incidents': `<span class="text-yellow">INCIDENT INDEX</span>

1  <span class="incident-red">INC-2024-09</span>  BGP hierarchy deletion during maintenance
2  <span class="incident-red">INC-2024-02</span>  Remote access VPN certificate expiry
3  <span class="incident-yellow">INC-2023-08</span>  Dark fiber path lost during external construction

<i class="text-dim">Tip: use show incident 1, show incident 2, or show incident 3</i>`,

    'show architecture': `<span class="text-yellow">=== NEXT-GEN NETWORK AUTOMATION & OBSERVABILITY ARCHITECTURE ===</span>

<span class="text-dim">[ SOURCE OF TRUTH ]</span>        <span class="text-dim">[ CI/CD PIPELINE ]</span>              <span class="text-dim">[ EXECUTION ]</span>

   +------------+         +---------------+           +-------------+
   |   NetBox   | API     | GitLab CI/CD  | Trigger   |   Ansible   |
   | (Inventory)|-------->| (Code/Review) |---------->| (Playbooks) |
   +------------+         +---------------+           +-------------+
         |                        |                          |
         |         +--------------v--------------+           | Push Config
         |         |           Batfish           |           | (API/SSH)
         +-------->| (Pre-deployment Validation) |           |
       Inventory   +-----------------------------+           v

                                                   +===================+
                                                   |   CORE NETWORK    |
                                                   |  (IOS-XR / NXOS)  |
                                                   +===================+
                                                      |           |
<span class="text-dim">[ TELEMETRY & METRICS ]</span>                     gNMI |           | NetFlow / BMP
                                                      |           |

                                         +------------v+    +-----v------+
                                         |  Telegraf   |    |   pmacct   |
                                         | (Data Col)  |    |(Flow/BMP)  |
                                         +------------++    +-----+------+
                                                      |           |

                                         +-------+
                                         | Influx|
                                         | (Time |
                                         | Series)|
                                         +-------+`,

    'show dwdm': `<span class="text-yellow">=== ACTIVE DWDM / ENCRYPTED 400G DCI ===</span>

             <span class="text-dim">[ DC1 / WEST ]</span>                         <span class="text-dim">[ DC2 / WEST ]</span>
        +----------------------+               +----------------------+
        |  Smartoptics DWDM 1  |===============|  Smartoptics DWDM 1  |
        +----------+-----------+    West Fib   +-----------+----------+
                   |                                       |
              +----+-----+                           +-----+----+
              | EDFA/VOA |                           | EDFA/VOA |
              +----+-----+                           +-----+----+
                   |                                       |
   +-------------------------------+       +-------------------------------+
   | MPLS | VXLAN | EDGE | STORAGE |       | MPLS | VXLAN | EDGE | STORAGE |
   +-------------------------------+       +-------------------------------+
                   |                                       |
              +----+-----+                           +-----+----+
              | EDFA/VOA |                           | EDFA/VOA |
              +----+-----+                           +-----+----+
                   |                                       |
        +----------+-----------+    East Fib   +-----------+----------+
        |  Smartoptics DWDM 2  |===============|  Smartoptics DWDM 2  |
        +----------------------+               +----------------------+
             <span class="text-dim">[ DC1 / EAST ]</span>                         <span class="text-dim">[ DC2 / EAST ]</span>

<span class="text-yellow">Transport view:</span>
- <span class="text-green">Shared services:</span> MPLS routing, VXLAN fabric, Internet edge, and storage replication are presented across both optical paths.
- <span class="text-green">West/East path...</span> (See full documentation for complete details)`,

    'show ip route': `Codes: L - local, C - connected, S - static, B - BGP, O - OSPF

Gateway of last resort is 0.0.0.0 to network 0.0.0.0

B    0.0.0.0/0 [20/0] via AS24713 (Internet Edge)
       * Handles CGI external connectivity, peering policy, and edge routing.
O    10.0.0.0/8 [110/2] via AS1854 (MPLS & Segment Routing Backbone)
       * Core backbone providing traffic engineering and sub-second failover.
C    172.16.0.0/12 is directly connected, VXLAN_Fabric
       * Underlay/Overlay fabric supporting global Data Center hosting.
S    192.168.0.0/16 [1/0] via Zscaler_SASE
       * Zero-Trust remote user access (Migrated from legacy VPN).`,

    'show topology': `
      <span class="text-dim">[ External Networks ]</span>
               |
  +-------------------------+
  |  <a href="#" class="interactive-node" onclick="app.showConfig('edge')">[ AS24713 ] Internet Edge</a>  |
  +-------------------------+
         |           |
    <a href="#" class="interactive-node" onclick="app.showConfig('fw1')">(FW-01)</a>     <a href="#" class="interactive-node" onclick="app.showConfig('fw2')">(FW-02)</a>
         |           |
  +-------------------------+
  |  <a href="#" class="interactive-node" onclick="app.showConfig('core')">[ AS1854 ] Core MPLS Ring</a>  |
  +-------------------------+
         |           |
  +-------------------------+
  |  <a href="#" class="interactive-node" onclick="app.showConfig('fabric')">[ VXLAN ] DC Spine/Leaf</a>  |
  +-------------------------+
             |
      <span class="text-dim">[ CGI Cloud Hosting ]</span>

<i class="text-dim">Hint: Click on any colored node in the topology to view its configuration.</i>`,

    'show run edge': `Building configuration...
!
router bgp 24713
 bgp router-id 1.1.1.1
 description "CGI Internet Edge"
 neighbor TIER-1-ISP route-map PREFER-IN in
!
! Focus: Implemented BFD for sub-second failover and strict route-maps
! to control inbound transit traffic, guaranteeing high availability SLAs.`,

    'show run core': `Building configuration...
!
router isis 1
 net 49.0001.1921.6800.0001.00
 metric-style wide
!
segment-routing mpls
!
! Focus: Designed and operated the global MPLS backbone, migrating legacy
! LDP architectures to Segment Routing for advanced Traffic Engineering.`,

    'show run fabric': `Building configuration...
!
interface nve1
  no shutdown
  source-interface loopback1
  host-reachability protocol bgp
  member vni 10000 mcast-group 239.1.1.1
!
! Focus: Lead the transition of DC fabrics to EVPN/VXLAN. Reduced OpEx
! and hardware footprint while supporting massive multi-tenant scale.`,

    'show run fw1': `Firewall Policy - Primary Perimeter
!
! Action: Replaced EOL Cisco ASAs with Fortinet NGFWs.
! Result: Removed technical debt, eliminated "permit ip any any" rules,
! and integrated application-layer (Layer 7) visibility into the perimeter.`,

    'show run fw2': `Firewall Policy - Secondary Perimeter / SASE
!
! Action: Integrated Zscaler Zero-Trust architecture.
! Result: Deprecated legacy full-tunnel VPNs, eliminating datacenter hairpinning
! and reducing latency for ~4,000 remote workers globally.`,

    'top': `CPU utilization for five seconds: 85%/15%; one minute: 82%; five minutes: 78%
PID    Runtime(ms)   Invoked   uSecs   5Sec   1Min   5Min TTY Process
 101       3498234     1423    2458  45.2%  42.1%  39.8%   0 Python/Ansible (Automation)
 204       1823942      892    2044  22.5%  25.0%  28.1%   0 BGP Route Reflector Design
 305        923481      431    2142  12.3%  10.5%   9.2%   0 CCNP_SP_Study_Guide.pdf
 409        152341       45    3385   5.0%   4.4%   0.9%   0 Coffee.exe`,

    'curl': `StatusCode        : 200
StatusDescription : OK
Content           : 2606:4700:3031::ac43:cd56
RawContent        : HTTP/1.1 200 OK
                    Connection: keep-alive
                    Vary: Origin
                    cf-cache-status: DYNAMIC
                    CF-RAY: 9fca09dc1b485288-HEL
                    Content-Length: 25
                    Content-Type: text/plain
                    Date: {{CURRENT_TIME}}
                    Server: cloudflare

Wait... that Content IP is a Cloudflare proxy.
Are you sitting behind a WAF? Me too.`,

    'show interface': `Interface: Security (ASA to FortiGate Migration)
 Status: UP (Hardened)
 Description: Migrated EOL Cisco ASAs to Fortinet NGFWs. Executed a complete policy audit and redesign to eliminate technical debt and broad permit-any rules, resulting in a fully hardened, application-aware perimeter.

Interface: Tunnel0 (VPN Re-engineering)
 Status: UP (Optimized)
 Description: Re-architected legacy full-tunnel VPN to a split-tunnel model integrated with Zscaler SASE. Eliminated datacenter hairpinning, reducing bandwidth load and improving latency for ~4,000 remote users.

Interface: Optical-Ring (DWDM Metro Expansion)
 Status: UP (High-Capacity)
 Description: Designed and deployed inter-datacenter DWDM capacity across Helsinki using Smartoptics and ADVA. Managed optical power budgets and fiber routing to support growing east-west traffic demands.

Interface: AS24713-Edge (Internet Resilience)
 Status: UP (Sub-second Convergence)
 Description: Re-engineered BGP routing architecture. Implemented BFD and deterministic path selection, achieving sub-second failover and tighter availability SLAs for shared internet services.

Interface: Core-Fabric (DC Migration Program)
 Status: MIGRATED (Zero Impact)
 Description: Lead Network Engineer for a large-scale datacenter migration. Orchestrated the seamless transition of routing, switching, and firewall fabrics while reducing OpEx by decommissioning EOL hardware.`,

    'nmap': `Starting Nmap 7.93 ( https://nmap.org ) at {{CURRENT_TIME}}
Nmap scan report for localhost (127.0.0.1)
Host is up (0.00013s latency).
Not shown: 994 closed tcp ports (reset)

PORT      STATE SERVICE      VERSION
22/tcp    open  ssh          Secure Communication & Automation
80/tcp    open  http         REST API / Webhook Integration
179/tcp   open  bgp          Core Routing & Peering Policy
443/tcp   open  https        Encrypted Tunnels / SASE / IPsec
830/tcp   open  netconf      Infrastructure as Code (IaC)
6653/tcp  open  openflow     SDN & VXLAN Fabric Management

Nmap done: 1 IP address (1 host up) scanned in 0.42 seconds`,

    'show cdp nei': `Capability Codes: R - Router, T - Trans Bridge, B - Source Route Bridge
                  S - Switch, H - Host, I - IGMP, r - Repeater, P - Phone

Device ID        Local Intrfce     Holdtme    Capability  Platform  Port ID
Finnish          Eth 0/0           120        H R         Native    Bilingual
English          Eth 0/1           120        H R         Fluent    Professional
Team-Lead        Mgmt 0/0          120        S R         Human     Mentorship
Architecture     Po1               120        S R         Design    Big-Picture
Problem-Solve    Lo0               120        R           Logic     RCA`,

    'show version': `V-OS (tm) Network Operating System Software
Software Version 2026.05
Compiled by Väinö Rikkonen

System uptime is ${uptimeString}
System image file is "flash:vaino-rikkonen-v3.bin"

Active Licenses / Certifications:
 - <span class="text-yellow">Cisco CCNP Service Provider</span> <span class="text-dim">[In Progress]</span>`
  };

  // ============================================
  // Utility Functions
  // ============================================

  /**
   * Calculate Levenshtein distance between two strings
   */
  function levenshtein(a, b) {
    const matrix = Array.from({ length: b.length + 1 }, (_, i) => [i]);
    
    for (let j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
    }
    
    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    
    return matrix[b.length][a.length];
  }

  /**
   * Find the closest command match based on Levenshtein distance
   */
  function getClosestCommand(input, commandList) {
    let bestMatch = null;
    let bestScore = Infinity;
    
    for (const command of commandList) {
      const score = levenshtein(input.toLowerCase(), command.toLowerCase());
      
      if (score < bestScore) {
        bestScore = score;
        bestMatch = command;
      }
    }
    
    return { bestMatch, bestScore };
  }

  /**
   * Sleep utility for async delays
   */
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // ============================================
  // Application State Management
  // ============================================

  const app = {
    isRoot: false,
    awaitingPassword: false,
    currentPrompt: '<span class="prompt">guest@rikkova:~$ </span>',
    commandHistory: [],
    historyIndex: -1,
    lastJokeIndex: -1,
    forcedJokeIndex: -1,
    forcedJokeRepeatsLeft: 0,
    currentTheme: 'default',

    /**
     * Initialize the application
     */
    init() {
      this.terminal = document.getElementById('terminal');
      this.terminalBody = document.getElementById('terminal-body');
      this.cmdInput = document.getElementById('cmd');
      this.inputLine = document.getElementById('input-line');
      
      // Bind event listeners
      this.bindEvents();
      
      // Start boot sequence
      this.runBootSequence().then(() => {
        console.log('V-OS Terminal initialized successfully');
      });
    },

    /**
     * Bind all event listeners
     */
    bindEvents() {
      // Command input handling
      this.cmdInput.addEventListener('keydown', (e) => this.handleCommand(e));
      
      // Focus management - use event delegation on terminal body
      this.terminalBody.addEventListener('click', (e) => {
        if (e.target.tagName !== 'INPUT') {
          this.cmdInput.focus();
        }
      });

      // Prevent focus loss when clicking inside input
      this.cmdInput.addEventListener('mousedown', (e) => {
        e.stopPropagation();
      });
    },

    /**
     * Handle keyboard events in command input
     */
    handleCommand(e) {
      const key = e.key;

      // Arrow Up - History navigation
      if (key === 'ArrowUp') {
        e.preventDefault();
        this.navigateHistory(-1);
        return;
      } 
      
      // Arrow Down - History navigation
      else if (key === 'ArrowDown') {
        e.preventDefault();
        this.navigateHistory(1);
        return;
      }

      // Tab - Command completion
      else if (key === 'Tab') {
        e.preventDefault();
        this.completeCommand();
        return;
      }

      // Enter - Execute command
      else if (key === 'Enter') {
        const command = this.cmdInput.value.trim();
        if (command) {
          this.executeCommand(command);
        }
        
        // Clear input and scroll to bottom
        this.cmdInput.value = '';
        this.terminalBody.scrollTop = this.terminalBody.scrollHeight;
        return;
      }

      // Ctrl+C - Cancel current command (simulated)
      else if (key === 'c' && e.ctrlKey) {
        e.preventDefault();
        this.output('<span class="text-dim">^C</span>', false);
        this.terminalBody.scrollTop = this.terminalBody.scrollHeight;
      }

      // Ctrl+L - Clear screen
      else if (key === 'l' && e.ctrlKey) {
        e.preventDefault();
        this.clearScreen();
      }
    },

    /**
     * Navigate command history with arrow keys
     */
    navigateHistory(direction) {
      const maxIndex = this.commandHistory.length - 1;
      
      if (maxIndex < 0) return;
      
      if (this.historyIndex === -1 && direction === -1) return;
      
      if (direction === -1) {
        // Going up
        if (this.historyIndex < maxIndex) {
          this.historyIndex++;
        } else if (this.historyIndex === maxIndex) {
          this.historyIndex = -1;
        }
      } else {
        // Going down
        if (this.historyIndex > 0) {
          this.historyIndex--;
        } else if (this.historyIndex === 0) {
          this.historyIndex = -1;
        }
      }

      const historyEntry = this.commandHistory[this.commandHistory.length - 1 - this.historyIndex];
      
      if (historyEntry !== undefined && historyEntry !== null) {
        this.cmdInput.value = historyEntry;
      } else {
        this.cmdInput.value = '';
      }
    },

    /**
     * Complete command with tab key
     */
    async completeCommand() {
      const inputVal = this.cmdInput.value.trim().toLowerCase();
      
      if (!inputVal) return;

      // Check for exact match first
      const exactMatch = Object.keys(commands).find(cmd => 
        cmd.toLowerCase() === inputVal
      );

      if (exactMatch) {
        this.cmdInput.value = exactMatch;
        await sleep(100);
        this.executeCommand(exactMatch);
        return;
      }

      // Check for incident commands
      const incidentCommands = ['show incident 1', 'show incident 2', 'show incident 3'];
      const incidentMatch = incidentCommands.find(cmd => 
        cmd.toLowerCase().startsWith(inputVal)
      );

      if (incidentMatch) {
        this.cmdInput.value = incidentMatch;
        return;
      }

      // Fuzzy match for other commands
      const allCommands = Object.keys(commands).concat(
        'clear', 'sudo', 'history', 'whoami', 'ping', 
        'traceroute', 'wget resume', 'diagnostics', 'joke'
      );

      const { bestMatch, bestScore } = getClosestCommand(inputVal, allCommands);

      // Only complete if reasonably close (score <= 3)
      if (bestScore !== null && bestScore <= 3) {
        this.cmdInput.value = bestMatch;
      }
    },

    /**
     * Execute a command and display output
     */
    async executeCommand(input) {
      // Add to history
      this.commandHistory.push(input);
      this.historyIndex = -1;

      const normalizedInput = input.toLowerCase().trim();
      
      // Check for sudo escalation
      if (normalizedInput.startsWith('sudo ')) {
        await this.handleSudo(normalizedInput.substring(5));
        return;
      }

      // Route to appropriate handler
      switch (true) {
        case normalizedInput === 'help':
          this.output(commands['help']);
          break;
          
        case normalizedInput.startsWith('show bgp sum'):
          this.output(commands['show bgp sum']);
          break;
          
        case normalizedInput.startsWith('show architecture'):
          this.output(commands['show architecture']);
          break;
          
        case normalizedInput.startsWith('show dwdm'):
          this.output(commands['show dwdm']);
          break;
          
        case normalizedInput.startsWith('show ip route'):
          this.output(commands['show ip route']);
          break;
          
        case normalizedInput.startsWith('show topology'):
          this.output(commands['show topology']);
          break;
          
        case normalizedInput.startsWith('show run edge'):
          this.output(commands['show run edge']);
          break;
          
        case normalizedInput.startsWith('show run core'):
          this.output(commands['show run core']);
          break;
          
        case normalizedInput.startsWith('show run fabric'):
          this.output(commands['show run fabric']);
          break;
          
        case normalizedInput.startsWith('show run fw1'):
          this.output(commands['show run fw1']);
          break;
          
        case normalizedInput.startsWith('show run fw2'):
          this.output(commands['show run fw2']);
          break;
          
        case normalizedInput === 'top':
          this.output(commands['top']);
          break;
          
        case normalizedInput === 'curl':
          this.output(commands['curl']);
          break;
          
        case normalizedInput.startsWith('show interface'):
          this.output(commands['show interface']);
          break;
          
        case normalizedInput === 'nmap':
          this.output(commands['nmap']);
          break;
          
        case normalizedInput.startsWith('show cdp nei'):
          this.output(commands['show cdp nei']);
          break;
          
        case normalizedInput.startsWith('show version'):
          this.output(commands['show version'].replace('${uptimeString}', CONFIG.uptimeString));
          break;
          
        case normalizedInput === 'clear':
          this.clearScreen();
          break;
          
        case normalizedInput === 'joke':
          await this.tellJoke();
          break;
          
        case normalizedInput.startsWith('show incident'):
          const incidentMatch = Object.keys(incidentDetails).find(cmd => 
            cmd.toLowerCase() === normalizedInput
          );
          
          if (incidentMatch && incidentDetails[incidentMatch]) {
            incidentDetails[incidentMatch].forEach(line => {
              this.outputLine(line);
            });
          } else {
            this.output('Unknown incident. Use "show incidents" to see available incidents.');
          }
          break;
          
        case normalizedInput === 'whoami':
          this.handleWhoami();
          break;
          
        case normalizedInput === 'ping':
          this.handlePing();
          break;
          
        case normalizedInput.startsWith('traceroute'):
          this.handleTraceroute();
          break;
          
        case normalizedInput === 'tcpdump':
          this.handleTcpdump();
          break;
          
        case normalizedInput === 'wget resume':
          this.handleWgetResume();
          break;
          
        case normalizedInput.startsWith('theme'):
          await this.changeTheme(normalizedInput);
          break;
          
        case normalizedInput === 'diagnostics':
          this.handleDiagnostics();
          break;
          
        default:
          if (normalizedInput === '') {
            // Empty command, do nothing
          } else {
            this.output(`Command not found: ${input}`);
            
            // Show suggestions for similar commands
            const allCommands = Object.keys(commands).concat(
              'clear', 'sudo', 'history', 'whoami', 'ping', 
              'traceroute', 'wget resume', 'diagnostics', 'joke'
            );

            const { bestMatch, bestScore } = getClosestCommand(input.toLowerCase(), allCommands);
            
            if (bestMatch && bestScore <= 3) {
              this.outputLine(`Did you mean: <span class="text-yellow">${bestMatch}</span>?`);
            }
          }
      }

      // Update prompt based on user privileges
      const newPrompt = this.isRoot 
        ? '<span class="prompt">root@rikkova:~# </span>' 
        : '<span class="prompt">guest@rikkova:~$ </span>';
      
      this.currentPrompt = newPrompt;

      // Scroll to bottom
      this.terminalBody.scrollTop = this.terminalBody.scrollHeight;
    },

    /**
     * Handle sudo command escalation
     */
    async handleSudo(command) {
      if (this.isRoot) {
        await this.executeCommand(command);
      } else {
        // Simulate password prompt
        const passwordPrompt = document.createElement('div');
        passwordPrompt.className = 'output';
        passwordPrompt.innerHTML = '<span class="text-dim">Password: </span>';
        
        this.outputLine(passwordPrompt.innerHTML, false);
        this.terminalBody.scrollTop = this.terminalBody.scrollHeight;

        // Simulate delay and grant access
        await sleep(500);
        this.output('Access Granted');
        
        this.isRoot = true;
        this.currentPrompt = '<span class="prompt">root@rikkova:~# </span>';
      }
    },

    /**
     * Display a joke from the network jokes database
     */
    async tellJoke() {
      let jokeIndex;
      
      if (this.forcedJokeRepeatsLeft > 0) {
        jokeIndex = this.forcedJokeIndex;
        this.forcedJokeRepeatsLeft--;
      } else {
        // Avoid repeating the same joke twice in a row
        do {
          jokeIndex = Math.floor(Math.random() * networkJokes.length);
        } while (jokeIndex === this.lastJokeIndex && networkJokes.length > 1);
        
        this.lastJokeIndex = jokeIndex;
      }

      const joke = networkJokes[jokeIndex];
      
      // Type out the joke character by character
      for (const char of joke) {
        if (char === '\n') {
          this.outputLine('<br>');
        } else {
          this.output(char);
        }
        await sleep(CONFIG.bootDelay);
      }

      // Reset forced joke counter
      this.forcedJokeIndex = -1;
      this.forcedJokeRepeatsLeft = 0;
    },

    /**
     * Handle whoami command
     */
    handleWhoami() {
      const profileInfo = `Name: Väinö Rikkonen
Role: Infrastructure Architect at CGI (Helsinki)
Experience: 9 years in infrastructure environments
Expertise: BGP/OSPF routing, VXLAN-EVPN, MPLS, DWDM connectivity
Automation: Ansible/Python - reduced manual touchpoints by 50% across 100+ devices
Observability: TIG stack (Telegraf, InfluxDB, Grafana)
Education: Vocational Qualification in Business IT`;

      this.output(profileInfo);
    },

    /**
     * Handle ping command - display contact details
     */
    handlePing() {
      const contactInfo = `Contact Information:
Email: vaino.rikkonen@example.com
Location: Helsinki, Finland
LinkedIn: linkedin.com/in/vainorikkonen
GitHub: github.com/vainorikkonen

Note: Replace with actual contact details`;

      this.output(contactInfo);
    },

    /**
     * Handle traceroute command - display career path
     */
    handleTraceroute() {
      const careerPath = `traceroute to CareerGoal (10.255.255.1), 30 hops max, 60 byte packets
 1  localhost                   0.000 ms      0.001 ms      0.002 ms
 2  VocationalTraining           1.234 ms      1.456 ms      1.678 ms
 3  GoogleHyperscale             5.678 ms      5.890 ms      6.123 ms
 4  AccentureCyberDefense        12.345 ms     12.567 ms     12.789 ms
 5  CGIInfrastructure            15.678 ms     15.890 ms     16.123 ms
 6  CareerGoal                   *             *             25.456 ms`;

      this.output(careerPath);
    },

    /**
     * Handle tcpdump command - simulate live traffic capture
     */
    handleTcpdump() {
      const trafficCapture = `tcpdump: listening on lo, link-type EN10MB (Ethernet), snapshot length 262144 bytes

00:15:23.123456 IP localhost.54321 > localhost.http: Flags [P.]
00:15:23.234567 IP localhost.http > localhost.54321: P_ACK
00:15:23.345678 IP localhost.179 > 10.0.0.1.bgp: BGP_OPEN msg
00:15:23.456789 IP 10.0.0.1.bgp > localhost.179: BGP_KEEPALIVE

^C
6 packets captured
12 packets received by filter`;

      this.output(trafficCapture);
    },

    /**
     * Handle wget resume command
     */
    handleWgetResume() {
      this.output(`Downloading resume...

% Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed

  0     0    0     0    0     0      0      0 --:--:-- --:--:-- --:--:--     0
100 24567  100 24567   100  24567    100  24567 --:--:-- --:--:-- --:--:-- 52345

Resume downloaded to ~/vaino-rikkonen-resume.pdf`);
    },

    /**
     * Handle diagnostics command
     */
    handleDiagnostics() {
      const diagnostics = `Running system diagnostics...

[OK] Memory integrity check passed (16384Mb)
[OK] NVRAM consistency verified
[OK] Flash filesystem mounted and readable
[OK] Control plane OS loaded successfully
[OK] Crypto engine operational [FIPS 140-2 ACTIVE]
[OK] IPv4 routing table loaded (${CONFIG.routingTableV4} prefixes)
[OK] IPv6 routing table loaded (${CONFIG.routingTableV6} prefixes)
[OK] Line protocols UP
[OK] All interfaces operational

System health: OPTIMAL`;

      this.output(diagnostics);
    },

    /**
     * Change terminal theme
     */
    async changeTheme(input) {
      const availableThemes = Object.keys(THEMES).join(', ');
      
      let themeName = input.split(' ')[1] || 'default';
      
      if (!THEMES[themeName]) {
        this.output(`Unknown theme: ${themeName}. Available themes: ${availableThemes}`);
        return;
      }

      // Apply new theme (in a real app, this would update CSS variables)
      this.currentTheme = themeName;
      
      const colorClass = `text-${themeName === 'default' ? 'green' : themeName}`;
      
      this.output(`Theme changed to: <span class="${colorClass}">${themeName}</span>`);
    },

    // ============================================
    // Boot Sequence Implementation
    // ============================================

    async runBootSequence() {
      const bootOutput = document.getElementById('boot-output');
      const inputLine = this.inputLine;

      // Helper to append HTML content
      const appendHtml = (html) => {
        if (!bootOutput.innerHTML) {
          bootOutput.innerHTML = html;
        } else {
          bootOutput.innerHTML += html;
        }
        this.terminalBody.scrollTop = this.terminalBody.scrollHeight;
      };

      // Helper for typewriter effect
      const typeText = async (text, delay = CONFIG.bootDelay) => {
        for (const char of text) {
          if (char === '\n') {
            appendHtml('<br>');
          } else {
            appendHtml(char);
          }
          await sleep(delay);
        }
      };

      // Calculate dynamic IP counts based on current hour
      const currentHour = new Date().getHours();
      CONFIG.routingTableV4 = (964200 + Math.floor(Math.random() * 450) + (currentHour * 15)).toLocaleString('en-US');
      CONFIG.routingTableV6 = (217400 + Math.floor(Math.random() * 80) + (currentHour * 5)).toLocaleString('en-US');

      // Calculate uptime string once at startup
      CONFIG.uptimeString = this.calculateUptime();

      // ASCII Logo animation
      const rawLogo = ` __     __      ____  _____ 
\\ \\   / /     / __ \\/ ____|
 \\ \\\/ /_____| |  | \\___ \\
  \\   /______| |  | |___) |
   \\_/        \\____/_____/`;

      const logoLines = rawLogo.split('\n');
      
      for (const line of logoLines) {
        appendHtml(`<span class="text-green">${line}</span><br>`);
        await sleep(CONFIG.logoDelay);
      }

      await sleep(150);
      appendHtml('V-OS Network Operating System v2.0<br>');
      await sleep(150);
      appendHtml(`Copyright (c) 1997-${new Date().getFullYear()} Väinö Rikkonen. All rights reserved.<br><br>`);
      await sleep(400);

      // Hardware initialization logs
      const hardwareLogs = [
        'Initializing hardware memory... 16384Mb OK',
        'Checking NVRAM consistency... OK',
        'Mounting flash filesystem... DONE',
        'Loading control plane OS... OK',
        'Initializing crypto engine... [FIPS 140-2 ACTIVE]'
      ];

      for (const log of hardwareLogs) {
        appendHtml(`<span class="text-dim">[sys]</span> ${log}<br>`);
        await sleep(CONFIG.hardwareLogDelay);
      }

      await sleep(300);
      appendHtml(`<span class="text-dim">[sys]</span> Loading IPv4 routing table... ${CONFIG.routingTableV4} prefixes<br>`);
      await sleep(150);
      appendHtml(`<span class="text-dim">[sys]</span> Loading IPv6 routing table... ${CONFIG.routingTableV6} prefixes<br>`);
      await sleep(150);
      appendHtml(`<span class="text-dim">[sys]</span> Bringing up line protocols... UP<br><br>`);
      await sleep(300);

      // SSH connection animation
      await typeText('Establishing SSH session');
      
      for (let i = 0; i < CONFIG.sshDotsCount; i++) {
        await sleep(CONFIG.sshGapBetweenDots);
        appendHtml('.');
      }
      
      await sleep(CONFIG.sshTotalDuration - (CONFIG.sshDotsCount * CONFIG.sshGapBetweenDots));
      appendHtml(' <span class="text-green">[OK]</span><br><br>');

      // User authentication sequence
      await typeText('User Access Verification\n\n');
      await sleep(200);
      await typeText('Login: ');
      await sleep(400);
      
      // Auto-type "guest" login
      for (let i = 0; i < 'guest'.length; i++) {
        appendHtml('g' === 'g' ? 'g' : '');
        await sleep(70);
      }
      appendHtml('\n');
      await sleep(200);
      
      appendHtml('Access: Granted\n');
      await sleep(400);
      
      appendHtml(`Type '<span class="text-green">help</span>' to see a list of available commands.<br>`);

      // Show input line and focus
      inputLine.style.display = 'flex';
      this.cmdInput.focus();
      this.terminalBody.scrollTop = this.terminalBody.scrollHeight;
    },

    /**
     * Calculate uptime string from birth date to now
     */
    calculateUptime() {
      const dob = CONFIG.uptimeDate;
      const now = new Date();
      
      let years = now.getFullYear() - dob.getFullYear();
      let months = now.getMonth() - dob.getMonth();
      let days = now.getDate() - dob.getDate();
      
      if (days < 0) {
        months--;
        days += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
      }
      
      if (months < 0) {
        years--;
        months += 12;
      }

      return `${years} years, ${months} months, ${days} days`;
    },

    /**
     * Output text to terminal
     */
    output(text, append = true) {
      if (append) {
        this.outputLine(text);
      } else {
        // Replace entire boot output
        document.getElementById('boot-output').innerHTML = text;
      }
    },

    /**
     * Output a single line to terminal
     */
    outputLine(html, append = true) {
      const div = document.createElement('div');
      div.className = 'output';
      div.innerHTML = html;
      
      if (append) {
        this.terminal.appendChild(div);
      } else {
        this.terminal.innerHTML = '';
        this.terminal.appendChild(div);
      }

      // Scroll to bottom after each output
      this.terminalBody.scrollTop = this.terminalBody.scrollHeight;
    },

    /**
     * Clear the terminal screen (keep input line)
     */
    clearScreen() {
      const bootOutput = document.getElementById('boot-output');
      bootOutput.innerHTML = '';
      
      // Scroll to bottom
      this.terminalBody.scrollTop = this.terminalBody.scrollHeight;
    }
  };

  // ============================================
  // Initialize Application on DOM Ready
  // ============================================

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => app.init());
  } else {
    app.init();
  }

})();
