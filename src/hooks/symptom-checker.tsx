import {useApplication, ApplicationContextValue, User} from 'providers/context';
import {symptomsByPage} from 'constants/symptoms';

interface SymptomCheckerHook {
  getNextScreen(currentPage?: string): string;
}

const isConsentToDo = (app: ApplicationContextValue): boolean =>
  !app.checkInConsent;
const isIntroToDo = (user?: User): boolean =>
  !user ||
  !user.gender ||
  !user.race ||
  !user.ethnicity ||
  !user.ageRange ||
  !user.county;

const isSymptomsPageToDo = (app: ApplicationContextValue): boolean =>
  !app.completedChecker;

export function useSymptomChecker(): SymptomCheckerHook {
  const app = useApplication();

  const getNextScreen = (currentPage?: string): string => {
    const symptomPages: [string, boolean][] = symptomsByPage.map((_, index) => [
      `checker.symptoms.${index + 1}`,
      isSymptomsPageToDo(app)
    ]);

    const pages: [string, boolean][] = [
      ['checker.consent', isConsentToDo(app)],
      ['checker.intro', isIntroToDo(app.user)],
      ...symptomPages,
      ['checker.final', true]
    ];

    const start = pages.findIndex((p) => p[0] === currentPage) + 1;
    const nextPage = pages.slice(start).find((p) => p[1]);

    return nextPage ? nextPage[0] : 'history';
  };

  return {getNextScreen};
}
