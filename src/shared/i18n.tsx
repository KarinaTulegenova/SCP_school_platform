import { createContext, ReactNode, useContext, useMemo, useState } from 'react';

export type Language = 'ru' | 'kk';

type Dictionary = Record<string, string>;

const dictionaries: Record<Language, Dictionary> = {
  ru: {
    'common.loading': 'Загрузка...',
    'common.save': 'Сохранить',
    'common.add': 'Добавить',
    'common.download': 'Скачать',
    'common.openLink': 'Открыть ссылку',
    'common.logout': 'Выйти',
    'common.back': 'Назад',
    'header.platform': 'Образовательная платформа',
    'header.school': 'SCP School',
    'header.progress': 'Прогресс',
    'header.points': 'Баллы',
    'landing.badge': 'Навыки будущего для детей',
    'landing.title': 'Школа программирования, где дети учатся создавать реальные проекты',
    'landing.subtitle': 'Интерактивные уроки, домашние задания с проверкой преподавателем и трекинг прогресса.',
    'landing.start': 'Начать обучение',
    'landing.haveAccount': 'У меня уже есть аккаунт',
    'landing.card1.title': 'Живые онлайн-уроки',
    'landing.card1.body': 'Видеоуроки и практика в одном потоке без скучной теории.',
    'landing.card2.title': 'Командные проекты',
    'landing.card2.body': 'Дети решают реальные задачи и учатся работать как junior-разработчики.',
    'landing.card3.title': 'Поддержка менторов',
    'landing.card3.body': 'Обратная связь по каждому домашнему заданию и понятные рекомендации.',
    'auth.backToLanding': '← Назад на главную',
    'auth.badge': 'Безопасная авторизация',
    'auth.loginTitle': 'Вход в аккаунт',
    'auth.registerTitle': 'Регистрация нового ученика',
    'auth.loginSubtitle': 'Войдите, чтобы продолжить обучение и видеть прогресс.',
    'auth.registerSubtitle': 'Самостоятельная регистрация доступна для роли STUDENT.',
    'auth.signIn': 'Войти',
    'auth.signUp': 'Регистрация',
    'auth.fullName': 'Полное имя',
    'auth.email': 'Email',
    'auth.password': 'Пароль',
    'auth.signingIn': 'Входим...',
    'auth.creating': 'Создаем аккаунт...',
    'auth.createAccount': 'Создать аккаунт',
    'auth.demoUsers': 'Демо пользователи',
    'dashboard.role': 'Панель роли',
    'dashboard.roleInfo': 'Ниже показаны модули по вашей роли и правам доступа.',
    'lessons.loading': 'Загрузка уроков...',
    'lessons.error': 'Не удалось загрузить уроки.',
    'lessons.unexpected': 'Неожиданная ошибка уроков.',
    'lessons.title': 'Мои курсы',
    'lessons.saving': 'Сохраняем прогресс...',
    'lessons.hint': 'Завершайте уроки, чтобы открыть следующий.',
    'lessons.videoAvailable': 'Видеоурок доступен',
    'lessons.open': 'Открыть урок',
    'lessons.start': 'Начать урок',
    'lessons.backToList': 'Назад к списку курсов',
    'lessons.completedLabel': 'Этот урок уже завершен.',
    'lessons.completing': 'Завершаем...',
    'lessons.markCompleted': 'Отметить как завершенный',
    'lessons.watchOnYoutube': 'Смотреть на YouTube',
    'lesson.status.locked': 'заблокирован',
    'lesson.status.in_progress': 'в процессе',
    'lesson.status.completed': 'завершен',
    'homework.title': 'Домашние задания',
    'homework.loading': 'Загрузка домашних заданий...',
    'homework.loadError': 'Не удалось загрузить домашние задания.',
    'homework.submitted': 'Отправлено',
    'homework.notSubmitted': 'Еще не отправлено',
    'homework.due': 'Срок',
    'homework.feedback': 'Комментарий преподавателя',
    'homework.needFile': 'Выберите файл перед отправкой.',
    'homework.needLink': 'Укажите ссылку перед отправкой.',
    'homework.submitSuccess': 'Домашнее задание успешно отправлено.',
    'homework.submitError': 'Не удалось отправить домашнее задание.',
    'homework.submissionUrl': 'Ссылка на решение',
    'homework.commentOptional': 'Комментарий (необязательно)',
    'homework.submit': 'Отправить',
    'homework.openLink': 'Открыть ссылку',
    'homework.status.Pending': 'Ожидает проверки',
    'homework.status.Graded': 'Проверено',
    'homework.status.Resubmit': 'Нужна доработка',
    'review.loading': 'Загрузка отправок...',
    'review.loadError': 'Не удалось загрузить отправки.',
    'review.title': 'Очередь проверки домашних заданий',
    'review.empty': 'Пока нет отправок.',
    'review.student': 'Ученик',
    'review.submittedAt': 'Отправлено',
    'review.note': 'Комментарий',
    'review.feedback': 'Обратная связь',
    'review.openLink': 'Открыть ссылку на решение',
    'review.download': 'Скачать файл',
    'review.feedbackPlaceholder': 'Комментарий для ученика',
    'review.markGraded': 'Отметить как проверенное',
    'review.requestResubmit': 'Запросить доработку',
    'review.saved': 'Проверка сохранена.',
    'review.saveError': 'Не удалось сохранить проверку.',
    'schedule.loading': 'Загрузка расписания...',
    'schedule.error': 'Не удалось загрузить расписание.',
    'schedule.title': 'Недельное расписание',
    'schedule.created': 'Пункт расписания создан.',
    'schedule.createError': 'Не удалось создать пункт расписания.',
    'schedule.updated': 'Пункт расписания обновлен.',
    'schedule.updateError': 'Не удалось обновить пункт расписания.',
    'schedule.deleted': 'Пункт расписания удален.',
    'schedule.deleteError': 'Не удалось удалить пункт расписания.',
    'schedule.day': 'День',
    'schedule.time': 'Время',
    'schedule.itemTitle': 'Название',
    'schedule.type': 'Тип',
    'users.loading': 'Загрузка пользователей...',
    'users.error': 'Не удалось загрузить пользователей.',
    'users.title': 'Управление пользователями',
    'users.created': 'Пользователь успешно создан.',
    'users.createError': 'Не удалось создать пользователя. Проверьте поля и ограничения ролей.',
    'users.roleError': 'Не удалось обновить роль.',
    'users.deleteError': 'Не удалось удалить пользователя.',
    'users.fullName': 'Полное имя',
    'users.add': 'Добавить',
    'protected.checking': 'Проверяем доступ...',
    'protected.signIn': 'Войдите, чтобы получить доступ к этому разделу.',
    'protected.roleDenied': 'Доступ запрещен для этой роли.',
    'protected.permissionMissing': 'Недостаточно прав доступа.',
    'teacher.classManagement': 'Управление классом',
    'teacher.grade': 'Класс',
    'teacher.completion': 'Выполнение',
    'teacher.uploadHomework': 'Загрузка ДЗ',
    'teacher.uploadHomeworkHint': 'Прикрепляйте файлы или ссылки на материалы.',
    'teacher.addVideos': 'Добавление видеоуроков',
    'teacher.addVideosHint': 'Публикация ссылки на видео и метаданных урока.',
    'teacher.monitor': 'Мониторинг прогресса',
    'teacher.monitorHint': 'Следите за оценками и динамикой завершения.',
    'admin.userManagement': 'Управление пользователями',
    'admin.userManagementHint': 'Управление учениками, преподавателями и администраторами.',
    'admin.scheduleEditor': 'Редактор расписания',
    'admin.scheduleEditorHint': 'Редактирование вебинаров и учебного календаря.',
    'admin.analytics': 'Аналитика платформы',
    'admin.analyticsHint': 'Просмотр вовлеченности и результатов обучения.',
    'admin.fullAccess': 'Полный доступ администратора включен.',
    'role.STUDENT': 'Ученик',
    'role.TEACHER': 'Преподаватель',
    'role.ADMIN': 'Администратор',
    'lang.ru': 'Рус',
    'lang.kk': 'Қаз'
  },
  kk: {
    'common.loading': 'Жүктелуде...',
    'common.save': 'Сақтау',
    'common.add': 'Қосу',
    'common.download': 'Жүктеу',
    'common.openLink': 'Сілтемені ашу',
    'common.logout': 'Шығу',
    'common.back': 'Артқа',
    'header.platform': 'Білім платформасы',
    'header.school': 'SCP School',
    'header.progress': 'Прогресс',
    'header.points': 'Ұпай',
    'landing.badge': 'Балаларға арналған болашақ дағдылары',
    'landing.title': 'Балалар нақты жобалар жасайтын бағдарламалау мектебі',
    'landing.subtitle': 'Интерактив сабақтар, мұғалім тексеретін үй жұмысы және прогресті бақылау.',
    'landing.start': 'Оқуды бастау',
    'landing.haveAccount': 'Менде аккаунт бар',
    'landing.card1.title': 'Тікелей онлайн сабақтар',
    'landing.card1.body': 'Видео мен практика бірге, артық теориясыз.',
    'landing.card2.title': 'Командалық жобалар',
    'landing.card2.body': 'Балалар нақты тапсырма шешіп, junior деңгейінде жұмыс істейді.',
    'landing.card3.title': 'Ментор қолдауы',
    'landing.card3.body': 'Әр үй жұмысына кері байланыс және түсінікті ұсыныстар.',
    'auth.backToLanding': '← Басты бетке оралу',
    'auth.badge': 'Қауіпсіз авторизация',
    'auth.loginTitle': 'Аккаунтқа кіру',
    'auth.registerTitle': 'Жаңа оқушыны тіркеу',
    'auth.loginSubtitle': 'Оқуды жалғастыру және прогресті көру үшін кіріңіз.',
    'auth.registerSubtitle': 'Өздігінен тіркелу STUDENT рөлі үшін қолжетімді.',
    'auth.signIn': 'Кіру',
    'auth.signUp': 'Тіркелу',
    'auth.fullName': 'Толық аты-жөні',
    'auth.email': 'Email',
    'auth.password': 'Құпиясөз',
    'auth.signingIn': 'Кіріп жатырмыз...',
    'auth.creating': 'Аккаунт ашылып жатыр...',
    'auth.createAccount': 'Аккаунт құру',
    'auth.demoUsers': 'Демо пайдаланушылар',
    'dashboard.role': 'Рөл панелі',
    'dashboard.roleInfo': 'Төменде рөліңізге сай модульдер көрсетілген.',
    'lessons.loading': 'Сабақтар жүктелуде...',
    'lessons.error': 'Сабақтарды жүктеу мүмкін болмады.',
    'lessons.unexpected': 'Сабақтар бойынша күтпеген қате.',
    'lessons.title': 'Менің курстарым',
    'lessons.saving': 'Прогресс сақталуда...',
    'lessons.hint': 'Келесі сабақты ашу үшін сабақтарды аяқтаңыз.',
    'lessons.videoAvailable': 'Видео сабақ қолжетімді',
    'lessons.open': 'Сабақты ашу',
    'lessons.start': 'Сабақты бастау',
    'lessons.backToList': 'Курс тізіміне оралу',
    'lessons.completedLabel': 'Бұл сабақ аяқталған.',
    'lessons.completing': 'Аяқталып жатыр...',
    'lessons.markCompleted': 'Аяқталды деп белгілеу',
    'lessons.watchOnYoutube': 'YouTube-та көру',
    'lesson.status.locked': 'құлыпталған',
    'lesson.status.in_progress': 'процесте',
    'lesson.status.completed': 'аяқталды',
    'homework.title': 'Үй тапсырмасы',
    'homework.loading': 'Үй тапсырмасы жүктелуде...',
    'homework.loadError': 'Үй тапсырмасын жүктеу мүмкін болмады.',
    'homework.submitted': 'Жіберілген',
    'homework.notSubmitted': 'Әлі жіберілмеген',
    'homework.due': 'Тапсыру күні',
    'homework.feedback': 'Мұғалімнің пікірі',
    'homework.needFile': 'Жібермес бұрын файл таңдаңыз.',
    'homework.needLink': 'Жібермес бұрын сілтемені енгізіңіз.',
    'homework.submitSuccess': 'Үй тапсырмасы сәтті жіберілді.',
    'homework.submitError': 'Үй тапсырмасын жіберу мүмкін болмады.',
    'homework.submissionUrl': 'Жұмыс сілтемесі',
    'homework.commentOptional': 'Пікір (міндетті емес)',
    'homework.submit': 'Жіберу',
    'homework.openLink': 'Сілтемені ашу',
    'homework.status.Pending': 'Тексеруді күтуде',
    'homework.status.Graded': 'Тексерілді',
    'homework.status.Resubmit': 'Қайта тапсыру керек',
    'review.loading': 'Жіберілімдер жүктелуде...',
    'review.loadError': 'Жіберілімдерді жүктеу мүмкін болмады.',
    'review.title': 'Үй жұмысы тексеру кезегі',
    'review.empty': 'Әзірге жіберілім жоқ.',
    'review.student': 'Оқушы',
    'review.submittedAt': 'Жіберілген уақыты',
    'review.note': 'Пікір',
    'review.feedback': 'Кері байланыс',
    'review.openLink': 'Жіберілген сілтемені ашу',
    'review.download': 'Файлды жүктеу',
    'review.feedbackPlaceholder': 'Оқушыға пікір',
    'review.markGraded': 'Тексерілді деп белгілеу',
    'review.requestResubmit': 'Қайта тапсыруды сұрау',
    'review.saved': 'Тексеру сақталды.',
    'review.saveError': 'Тексеруді сақтау мүмкін болмады.',
    'schedule.loading': 'Кесте жүктелуде...',
    'schedule.error': 'Кестені жүктеу мүмкін болмады.',
    'schedule.title': 'Апталық кесте',
    'schedule.created': 'Кесте тармағы құрылды.',
    'schedule.createError': 'Кесте тармағын құру мүмкін болмады.',
    'schedule.updated': 'Кесте тармағы жаңартылды.',
    'schedule.updateError': 'Кесте тармағын жаңарту мүмкін болмады.',
    'schedule.deleted': 'Кесте тармағы жойылды.',
    'schedule.deleteError': 'Кесте тармағын жою мүмкін болмады.',
    'schedule.day': 'Күн',
    'schedule.time': 'Уақыт',
    'schedule.itemTitle': 'Атауы',
    'schedule.type': 'Түрі',
    'users.loading': 'Пайдаланушылар жүктелуде...',
    'users.error': 'Пайдаланушыларды жүктеу мүмкін болмады.',
    'users.title': 'Пайдаланушыларды басқару',
    'users.created': 'Пайдаланушы сәтті құрылды.',
    'users.createError': 'Пайдаланушыны құру мүмкін болмады. Өрістерді тексеріңіз.',
    'users.roleError': 'Рөлді жаңарту мүмкін болмады.',
    'users.deleteError': 'Пайдаланушыны жою мүмкін болмады.',
    'users.fullName': 'Толық аты-жөні',
    'users.add': 'Қосу',
    'protected.checking': 'Қолжетімділік тексерілуде...',
    'protected.signIn': 'Бұл бөлімге кіру үшін аккаунтқа кіріңіз.',
    'protected.roleDenied': 'Бұл рөл үшін қолжетімді емес.',
    'protected.permissionMissing': 'Құқық жеткіліксіз.',
    'teacher.classManagement': 'Сыныпты басқару',
    'teacher.grade': 'Сынып',
    'teacher.completion': 'Аяқталуы',
    'teacher.uploadHomework': 'Үй тапсырмасын жүктеу',
    'teacher.uploadHomeworkHint': 'Файлдар мен материал сілтемелерін қосыңыз.',
    'teacher.addVideos': 'Видео сабақ қосу',
    'teacher.addVideosHint': 'Видео сілтеме және сабақ метадеректерін жариялау.',
    'teacher.monitor': 'Прогресті бақылау',
    'teacher.monitorHint': 'Баға мен аяқталу динамикасын қадағалау.',
    'admin.userManagement': 'Пайдаланушыларды басқару',
    'admin.userManagementHint': 'Оқушылар, мұғалімдер және админдерді басқару.',
    'admin.scheduleEditor': 'Кесте редакторы',
    'admin.scheduleEditorHint': 'Вебинарлар мен оқу күнтізбесін түзету.',
    'admin.analytics': 'Платформа аналитикасы',
    'admin.analyticsHint': 'Қатысу және оқу нәтижелерін көру.',
    'admin.fullAccess': 'Әкімшінің толық қолжетімділігі қосулы.',
    'role.STUDENT': 'Оқушы',
    'role.TEACHER': 'Мұғалім',
    'role.ADMIN': 'Әкімші',
    'lang.ru': 'Рус',
    'lang.kk': 'Қаз'
  }
};

const I18nContext = createContext<{
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}>({
  lang: 'ru',
  setLang: () => undefined,
  t: (key: string) => key
});

const STORAGE_KEY = 'scp_lang';

export function I18nProvider({ children }: { children: ReactNode }): JSX.Element {
  const [lang, setLang] = useState<Language>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === 'kk' ? 'kk' : 'ru';
  });

  const value = useMemo(
    () => ({
      lang,
      setLang: (next: Language) => {
        localStorage.setItem(STORAGE_KEY, next);
        setLang(next);
      },
      t: (key: string) => dictionaries[lang][key] ?? dictionaries.ru[key] ?? key
    }),
    [lang]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return useContext(I18nContext);
}

export const translateDay = (day: string, lang: Language): string => {
  const key = `day.${day.toLowerCase()}`;
  const dayMap: Record<string, string> = {
    'day.monday': lang === 'ru' ? 'Понедельник' : 'Дүйсенбі',
    'day.tuesday': lang === 'ru' ? 'Вторник' : 'Сейсенбі',
    'day.wednesday': lang === 'ru' ? 'Среда' : 'Сәрсенбі',
    'day.thursday': lang === 'ru' ? 'Четверг' : 'Бейсенбі',
    'day.friday': lang === 'ru' ? 'Пятница' : 'Жұма',
    'day.saturday': lang === 'ru' ? 'Суббота' : 'Сенбі',
    'day.sunday': lang === 'ru' ? 'Воскресенье' : 'Жексенбі'
  };
  return dayMap[key] ?? day;
};

export const translateLessonTitle = (id: string, fallback: string, lang: Language): string => {
  const map: Record<Language, Record<string, string>> = {
    ru: {
      'html-intro': 'Введение в HTML',
      'css-colors': 'Цвета в CSS',
      'first-script': 'Первый скрипт'
    },
    kk: {
      'html-intro': 'HTML-ге кіріспе',
      'css-colors': 'CSS-тегі түстер',
      'first-script': 'Бірінші скрипт'
    }
  };
  return map[lang][id] ?? fallback;
};

export const translateLessonDescription = (id: string, fallback: string, lang: Language): string => {
  const map: Record<Language, Record<string, string>> = {
    ru: {
      'html-intro': 'Создайте свою первую страницу с заголовками, абзацами и списками.',
      'css-colors': 'Изучите названия цветов, hex-значения и градиенты для красивого дизайна.',
      'first-script': 'Напишите свой первый JavaScript и сделайте кнопку интерактивной.'
    },
    kk: {
      'html-intro': 'Тақырыптар, абзацтар және тізімдермен алғашқы бетіңізді жасаңыз.',
      'css-colors': 'Әдемі дизайн үшін түс атаулары, hex мәндері және градиенттерді үйреніңіз.',
      'first-script': 'Алғашқы JavaScript-ті жазып, батырманы интерактивті етіңіз.'
    }
  };
  return map[lang][id] ?? fallback;
};
