
const mlbTeams = [
  ["Arizona Diamondbacks", "Phoenix, Arizona", "ARI", "diamondbacks"],
  ["Atlanta Braves", "Atlanta, Georgia", "ATL", "braves"],
  ["Baltimore Orioles", "Baltimore, Maryland", "BAL", "orioles"],
  ["Boston Red Sox", "Boston, Massachusetts", "BOS", "redsox"],
  ["Chicago Cubs", "Chicago, Illinois", "CHC", "cubs"],
  ["Chicago White Sox", "Chicago, Illinois", "CWS", "whitesox"],
  ["Cincinnati Reds", "Cincinnati, Ohio", "CIN", "reds"],
  ["Cleveland Guardians", "Cleveland, Ohio", "CLE", "guardians"],
  ["Colorado Rockies", "Denver, Colorado", "COL", "rockies"],
  ["Detroit Tigers", "Detroit, Michigan", "DET", "tigers"],
  ["Houston Astros", "Houston, Texas", "HOU", "astros"],
  ["Kansas City Royals", "Kansas City, Missouri", "KC", "royals"],
  ["Los Angeles Angels", "Anaheim, California", "LAA", "angels"],
  ["Los Angeles Dodgers", "Los Angeles, California", "LAD", "dodgers"],
  ["Miami Marlins", "Miami, Florida", "MIA", "marlins"],
  ["Milwaukee Brewers", "Milwaukee, Wisconsin", "MIL", "brewers"],
  ["Minnesota Twins", "Minneapolis, Minnesota", "MIN", "twins"],
  ["New York Mets", "Queens, New York", "NYM", "mets"],
  ["New York Yankees", "Bronx, New York", "NYY", "yankees"],
  ["Athletics", "West Sacramento, California", "ATH", "athletics"],
  ["Philadelphia Phillies", "Philadelphia, Pennsylvania", "PHI", "phillies"],
  ["Pittsburgh Pirates", "Pittsburgh, Pennsylvania", "PIT", "pirates"],
  ["San Diego Padres", "San Diego, California", "SD", "padres"],
  ["San Francisco Giants", "San Francisco, California", "SF", "giants"],
  ["Seattle Mariners", "Seattle, Washington", "SEA", "mariners"],
  ["St. Louis Cardinals", "St. Louis, Missouri", "STL", "cardinals"],
  ["Tampa Bay Rays", "St. Petersburg, Florida", "TB", "rays"],
  ["Texas Rangers", "Arlington, Texas", "TEX", "rangers"],
  ["Toronto Blue Jays", "Toronto, Ontario", "TOR", "bluejays"],
  ["Washington Nationals", "Washington, D.C.", "WSH", "nationals"]
].map(([name, city, code, slug]) => ({
  name, city, code, league: "MLB",
  url: `https://www.mlb.com/${slug}`
}));

const nbaTeams = [
  ["Atlanta Hawks", "Atlanta, Georgia", "ATL", "hawks"],
  ["Boston Celtics", "Boston, Massachusetts", "BOS", "celtics"],
  ["Brooklyn Nets", "Brooklyn, New York", "BKN", "nets"],
  ["Charlotte Hornets", "Charlotte, North Carolina", "CHA", "hornets"],
  ["Chicago Bulls", "Chicago, Illinois", "CHI", "bulls"],
  ["Cleveland Cavaliers", "Cleveland, Ohio", "CLE", "cavaliers"],
  ["Dallas Mavericks", "Dallas, Texas", "DAL", "mavericks"],
  ["Denver Nuggets", "Denver, Colorado", "DEN", "nuggets"],
  ["Detroit Pistons", "Detroit, Michigan", "DET", "pistons"],
  ["Golden State Warriors", "San Francisco, California", "GSW", "warriors"],
  ["Houston Rockets", "Houston, Texas", "HOU", "rockets"],
  ["Indiana Pacers", "Indianapolis, Indiana", "IND", "pacers"],
  ["LA Clippers", "Inglewood, California", "LAC", "clippers"],
  ["Los Angeles Lakers", "Los Angeles, California", "LAL", "lakers"],
  ["Memphis Grizzlies", "Memphis, Tennessee", "MEM", "grizzlies"],
  ["Miami Heat", "Miami, Florida", "MIA", "heat"],
  ["Milwaukee Bucks", "Milwaukee, Wisconsin", "MIL", "bucks"],
  ["Minnesota Timberwolves", "Minneapolis, Minnesota", "MIN", "timberwolves"],
  ["New Orleans Pelicans", "New Orleans, Louisiana", "NOP", "pelicans"],
  ["New York Knicks", "New York, New York", "NYK", "knicks"],
  ["Oklahoma City Thunder", "Oklahoma City, Oklahoma", "OKC", "thunder"],
  ["Orlando Magic", "Orlando, Florida", "ORL", "magic"],
  ["Philadelphia 76ers", "Philadelphia, Pennsylvania", "PHI", "sixers"],
  ["Phoenix Suns", "Phoenix, Arizona", "PHX", "suns"],
  ["Portland Trail Blazers", "Portland, Oregon", "POR", "blazers"],
  ["Sacramento Kings", "Sacramento, California", "SAC", "kings"],
  ["San Antonio Spurs", "San Antonio, Texas", "SAS", "spurs"],
  ["Toronto Raptors", "Toronto, Ontario", "TOR", "raptors"],
  ["Utah Jazz", "Salt Lake City, Utah", "UTA", "jazz"],
  ["Washington Wizards", "Washington, D.C.", "WAS", "wizards"]
].map(([name, city, code, slug]) => ({
  name, city, code, league: "NBA",
  url: `https://www.nba.com/${slug}`
}));

const allTeams = [...mlbTeams, ...nbaTeams];

document.addEventListener("DOMContentLoaded", () => {
  // Highlight the navigation link for the current page.
  const currentPage = document.body.dataset.page;
  document.querySelectorAll("[data-nav]").forEach(link => {
    if (link.dataset.nav === currentPage) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }
  });

  // Show the current year in the footer.
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  // Dark mode works on every page.
  const themeToggle = document.getElementById("themeToggle");
  const savedTheme = localStorage.getItem("sportsCentralTheme") || "light";
  document.documentElement.dataset.theme = savedTheme;

  function updateThemeButton() {
    if (!themeToggle) return;
    const dark = document.documentElement.dataset.theme === "dark";
    themeToggle.innerHTML = dark
      ? '<i class="bi bi-sun-fill"></i> Light Mode'
      : '<i class="bi bi-moon-stars-fill"></i> Dark Mode';
  }

  updateThemeButton();

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const nextTheme =
        document.documentElement.dataset.theme === "dark" ? "light" : "dark";
      document.documentElement.dataset.theme = nextTheme;
      localStorage.setItem("sportsCentralTheme", nextTheme);
      updateThemeButton();
    });
  }

  // Team directory: all 30 MLB teams and all 30 NBA teams.
  const teamGrid = document.getElementById("teamGrid");
  if (!teamGrid) return;

  const searchInput = document.getElementById("teamSearch");
  const filterButtons = document.querySelectorAll("[data-filter]");
  const teamCount = document.getElementById("teamCount");
  const noTeams = document.getElementById("noTeams");

  let activeFilter = "all";
  let favorites = [];

  try {
    favorites = JSON.parse(localStorage.getItem("sportsCentralFavorites") || "[]");
    if (!Array.isArray(favorites)) favorites = [];
  } catch {
    favorites = [];
  }

  function saveFavorites() {
    localStorage.setItem("sportsCentralFavorites", JSON.stringify(favorites));
  }

  function renderTeams() {
    const search = (searchInput?.value || "").trim().toLowerCase();

    const filteredTeams = allTeams.filter(team => {
      const matchesSearch =
        `${team.name} ${team.city} ${team.code} ${team.league}`
          .toLowerCase().includes(search);

      const matchesFilter =
        activeFilter === "all" ||
        (activeFilter === "favorites" && favorites.includes(team.league + ":" + team.code)) ||
        team.league === activeFilter;

      return matchesSearch && matchesFilter;
    });

    teamGrid.innerHTML = filteredTeams.map(team => {
      const id = team.league + ":" + team.code;
      const saved = favorites.includes(id);
      const monogramClass = team.league === "NBA" ? "team-monogram nba" : "team-monogram";

      return `
        <div class="col-sm-6 col-lg-4 col-xl-3">
          <article class="team-card">
            <div class="team-card-top">
              <div class="${monogramClass}">${team.code}</div>
              <div>
                <span class="team-league">${team.league}</span>
                <h3>${team.name}</h3>
                <p class="team-city">${team.city}</p>
              </div>
            </div>
            <div class="team-card-actions">
              <a class="team-site" href="${team.url}" target="_blank" rel="noopener noreferrer">
                Official Site <i class="bi bi-arrow-up-right"></i>
              </a>
              <button class="favorite-btn ${saved ? "saved" : ""}"
                type="button" data-favorite="${id}"
                aria-label="${saved ? "Remove" : "Add"} ${team.name} ${saved ? "from" : "to"} favorites"
                aria-pressed="${saved}">
                <i class="bi ${saved ? "bi-heart-fill" : "bi-heart"}"></i>
              </button>
            </div>
          </article>
        </div>`;
    }).join("");

    teamCount.textContent = `Showing ${filteredTeams.length} of ${allTeams.length} teams`;
    noTeams.classList.toggle("d-none", filteredTeams.length !== 0);

    filterButtons.forEach(button => {
      const active = button.dataset.filter === activeFilter;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
  }

  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      activeFilter = button.dataset.filter;
      renderTeams();
    });
  });

  if (searchInput) {
    searchInput.addEventListener("input", renderTeams);
  }

  teamGrid.addEventListener("click", event => {
    const button = event.target.closest("[data-favorite]");
    if (!button) return;

    const id = button.dataset.favorite;
    if (favorites.includes(id)) {
      favorites = favorites.filter(item => item !== id);
    } else {
      favorites.push(id);
    }

    saveFavorites();
    renderTeams();
  });

  renderTeams();
});
