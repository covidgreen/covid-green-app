import {useApplication, ApplicationContextValue, User} from 'providers/context';
import {symptomsByPage, Symptom} from 'constants/symptoms';

interface SymptomCheckerHook {
  getNextScreen(currentPage?: string, options?: NextScreenOptions): string;
}

interface NextScreenOptions {
  skipQuickCheckIn?: boolean;
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
const isQuickCheckToDo = (options?: NextScreenOptions): boolean =>
  !options || !options.skipQuickCheckIn;
const isSymptomsPageToDo = (
  app: ApplicationContextValue,
  nextPageSymptoms: Symptom[] | undefined
): boolean => {
  if (app.completedChecker) {
    return false;
  }

  // If check in is incomplete, get last symptom selection page where user took any select action
  if (!nextPageSymptoms) {
    return true;
  }
  return (
    !app.checkerSymptoms ||
    nextPageSymptoms.every(
      (symptom: Symptom) => app.checkerSymptoms[symptom] === undefined
    )
  );
};

export function useSymptomChecker(): SymptomCheckerHook {
  const app = useApplication();

  const getNextScreen = (
    currentPage?: string,
    options?: NextScreenOptions
  ): string => {
    const symptomPages: [string, boolean][] = symptomsByPage.map((_, index) => [
      `checker.symptoms.${index + 1}`,
      isSymptomsPageToDo(app, symptomsByPage[index + 1])
    ]);

    const pages: [string, boolean][] = [
      ['checker.consent', isConsentToDo(app)],
      ['checker.intro', isIntroToDo(app.user)],
      ['checker.quick', isQuickCheckToDo(options)],
      ...symptomPages
    ];

    const start = pages.findIndex((p) => p[0] === currentPage) + 1;
    const nextPage = pages.slice(start).find((p) => p[1]);

    return nextPage ? nextPage[0] : 'history';
  };

  return {getNextScreen};
}
