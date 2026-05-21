import { makeAutoObservable, flow, runInAction } from "mobx";
import { MAX_SEARCH_HISTORY } from "@/src/lib/constants";
import { favoritesService, searchHistoryService } from "@/src/services";
import type { IFavoritesService, AddFavoritePayload } from "@/src/services/favorites.service";
import type { ISearchHistoryService } from "@/src/services/search-history.service";
import type { FavoriteCity } from "@/src/types/favorites";

class FavoritesStore {
  favorites: FavoriteCity[] = [];
  isLoadingFavorites = false;
  searchHistory: string[] = [];

  constructor(
    private readonly favService: IFavoritesService,
    private readonly historyService: ISearchHistoryService
  ) {
    makeAutoObservable(this, {
      loadFavorites: flow,
      addFavorite: flow,
      removeFavorite: flow,
      loadSearchHistory: flow,
      saveSearch: flow,
    });
  }

  isFavorite(cityName: string): boolean {
    return this.favorites.some((f) => f.city_name.toLowerCase() === cityName.toLowerCase());
  }

  *loadFavorites() {
    this.isLoadingFavorites = true;
    try {
      const favorites: FavoriteCity[] = yield this.favService.getAll();
      this.favorites = favorites;

      yield Promise.all(
        this.favorites.map(async (fav) => {
          try {
            const weather = await this.favService.getWeatherForCity(fav.city_name);
            runInAction(() => {
              fav.weather = weather;
            });
          } catch {
            // weather unavailable for this city
          }
        })
      );
    } catch {
      // user may not be authenticated
    } finally {
      this.isLoadingFavorites = false;
    }
  }

  *addFavorite(payload: AddFavoritePayload) {
    try {
      yield this.favService.add(payload);
      this.loadFavorites();
    } catch {
      // handle silently
    }
  }

  *removeFavorite(id: string) {
    try {
      yield this.favService.remove(id);
      this.favorites = this.favorites.filter((f) => f.id !== id);
    } catch {
      // handle silently
    }
  }

  *loadSearchHistory() {
    try {
      const searches: string[] = yield this.historyService.getRecent();
      this.searchHistory = searches;
    } catch {
      // not authenticated or unavailable
    }
  }

  *saveSearch(term: string) {
    try {
      yield this.historyService.save(term);
      this.searchHistory = [term, ...this.searchHistory.filter((s) => s !== term)].slice(
        0,
        MAX_SEARCH_HISTORY
      );
    } catch {
      // handle silently
    }
  }
}

export const favoritesStore = new FavoritesStore(favoritesService, searchHistoryService);
export type { FavoritesStore };
