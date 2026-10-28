// Lightweight, offline-first UI localization shared by the apk-fold applications.
// Source strings remain the French UI text; unknown strings safely fall back to French.
const LOCALES = [
  { code: 'fr', label: 'Français' },
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
  { code: 'de', label: 'Deutsch' },
  { code: 'it', label: 'Italiano' },
  { code: 'pt', label: 'Português' },
];

const ROWS = [
  ['Langue de l’interface','Interface language','Idioma de la interfaz','Sprache der Oberfläche','Lingua dell’interfaccia','Idioma da interface'],
  ['Accueil','Home','Inicio','Startseite','Home','Início'],
  ['Bibliothèque','Library','Biblioteca','Bibliothek','Libreria','Biblioteca'],
  ['Albums','Albums','Álbumes','Alben','Album','Álbuns'],
  ['Artistes','Artists','Artistas','Künstler','Artisti','Artistas'],
  ['Playlists','Playlists','Listas de reproducción','Playlists','Playlist','Playlists'],
  ['Plus','More','Más','Mehr','Altro','Mais'],
  ['Rechercher','Search','Buscar','Suchen','Cerca','Pesquisar'],
  ['Rechercher…','Search…','Buscar…','Suchen…','Cerca…','Pesquisar…'],
  ['Favoris','Favorites','Favoritos','Favoriten','Preferiti','Favoritos'],
  ['Genres','Genres','Géneros','Genres','Generi','Gêneros'],
  ['Radios','Radios','Radios','Radios','Radio','Rádios'],
  ['Hors-ligne','Offline','Sin conexión','Offline','Offline','Offline'],
  ['Réglages','Settings','Ajustes','Einstellungen','Impostazioni','Configurações'],
  ['Paramètres','Settings','Configuración','Einstellungen','Impostazioni','Configurações'],
  ['Personnalisation','Customization','Personalización','Personalisierung','Personalizzazione','Personalização'],
  ['Apparence','Appearance','Apariencia','Erscheinungsbild','Aspetto','Aparência'],
  ['Couleurs','Colors','Colores','Farben','Colori','Cores'],
  ['Police','Font','Fuente','Schriftart','Carattere','Fonte'],
  ['Affichage','Display','Visualización','Anzeige','Visualizzazione','Exibição'],
  ['Données','Data','Datos','Daten','Dati','Dados'],
  ['Sauvegarde','Backup','Copia de seguridad','Sicherung','Backup','Backup'],
  ['Sauvegardes','Backups','Copias de seguridad','Sicherungen','Backup','Backups'],
  ['Synchronisation','Synchronization','Sincronización','Synchronisierung','Sincronizzazione','Sincronização'],
  ['Synchroniser','Sync','Sincronizar','Synchronisieren','Sincronizza','Sincronizar'],
  ['À propos','About','Acerca de','Über','Informazioni','Sobre'],
  ['Enregistrer','Save','Guardar','Speichern','Salva','Salvar'],
  ['Annuler','Cancel','Cancelar','Abbrechen','Annulla','Cancelar'],
  ['Fermer','Close','Cerrar','Schließen','Chiudi','Fechar'],
  ['Supprimer','Delete','Eliminar','Löschen','Elimina','Excluir'],
  ['Modifier','Edit','Editar','Bearbeiten','Modifica','Editar'],
  ['Ajouter','Add','Añadir','Hinzufügen','Aggiungi','Adicionar'],
  ['Créer','Create','Crear','Erstellen','Crea','Criar'],
  ['Importer','Import','Importar','Importieren','Importa','Importar'],
  ['Exporter','Export','Exportar','Exportieren','Esporta','Exportar'],
  ['Historique','History','Historial','Verlauf','Cronologia','Histórico'],
  ['Résumé','Summary','Resumen','Zusammenfassung','Riepilogo','Resumo'],
  ['Missions','Jobs','Misiones','Aufträge','Missioni','Missões'],
  ['Aujourd’hui','Today','Hoy','Heute','Oggi','Hoje'],
  ['Continuer','Continue','Continuar','Weiter','Continua','Continuar'],
  ['Retour','Back','Atrás','Zurück','Indietro','Voltar'],
  ['Oui','Yes','Sí','Ja','Sì','Sim'],
  ['Non','No','No','Nein','No','Não'],
  ['Valider','Confirm','Confirmar','Bestätigen','Conferma','Confirmar'],
  ['Langue','Language','Idioma','Sprache','Lingua','Idioma'],
  ['Thème','Theme','Tema','Thema','Tema','Tema'],
  ['Sombre','Dark','Oscuro','Dunkel','Scuro','Escuro'],
  ['Noir (AMOLED)','Black (AMOLED)','Negro (AMOLED)','Schwarz (AMOLED)','Nero (AMOLED)','Preto (AMOLED)'],
  ['Clair','Light','Claro','Hell','Chiaro','Claro'],
  ['Auto','Auto','Automático','Automatisch','Automatico','Automático'],
  ['Couleur principale','Main color','Color principal','Hauptfarbe','Colore principale','Cor principal'],
  ['Couleurs des majorations','Overtime colors','Colores de recargos','Zuschlagsfarben','Colori delle maggiorazioni','Cores dos adicionais'],
  ['Taille du texte','Text size','Tamaño del texto','Textgröße','Dimensione del testo','Tamanho do texto'],
  ['Animations','Animations','Animaciones','Animationen','Animazioni','Animações'],
  ['Vibrations','Haptics','Vibraciones','Vibrationen','Vibrazioni','Vibrações'],
  ['Confirmer','Confirm','Confirmar','Bestätigen','Conferma','Confirmar'],
  ['Réinitialiser','Reset','Restablecer','Zurücksetzen','Reimposta','Redefinir'],
  ['Réinitialiser l’apparence','Reset appearance','Restablecer apariencia','Erscheinungsbild zurücksetzen','Reimposta aspetto','Redefinir aparência'],
  ['Nom','Name','Nombre','Name','Nome','Nome'],
  ['Date','Date','Fecha','Datum','Data','Data'],
  ['Type','Type','Tipo','Typ','Tipo','Tipo'],
  ['Tout','All','Todo','Alle','Tutto','Tudo'],
  ['Documents','Documents','Documentos','Dokumente','Documenti','Documentos'],
  ['Classeurs','Spreadsheets','Hojas de cálculo','Tabellen','Fogli di calcolo','Planilhas'],
  ['Présentations','Presentations','Presentaciones','Präsentationen','Presentazioni','Apresentações'],
  ['Document','Document','Documento','Dokument','Documento','Documento'],
  ['Classeur','Spreadsheet','Hoja de cálculo','Tabelle','Foglio di calcolo','Planilha'],
  ['Présentation','Presentation','Presentación','Präsentation','Presentazione','Apresentação'],
  ['Traitement de texte','Word processing','Procesador de texto','Textverarbeitung','Elaborazione testi','Processador de texto'],
  ['Tableur et formules','Spreadsheet and formulas','Hoja de cálculo y fórmulas','Tabellenkalkulation und Formeln','Foglio di calcolo e formule','Planilha e fórmulas'],
  ['Diapositives','Slides','Diapositivas','Folien','Diapositive','Slides'],
  ['Aucun résultat.','No results.','Sin resultados.','Keine Ergebnisse.','Nessun risultato.','Nenhum resultado.'],
  ['Aucun fichier pour l’instant.','No files yet.','Todavía no hay archivos.','Noch keine Dateien.','Nessun file per ora.','Nenhum arquivo por enquanto.'],
  ['Aucun fichier pour l\'instant.','No files yet.','Todavía no hay archivos.','Noch keine Dateien.','Nessun file per ora.','Nenhum arquivo por enquanto.'],
  ['Format non pris en charge','Unsupported format','Formato no compatible','Nicht unterstütztes Format','Formato non supportato','Formato não compatível'],
  ['Connexion','Connection','Conexión','Verbindung','Connessione','Conexão'],
  ['Se connecter','Sign in','Iniciar sesión','Anmelden','Accedi','Entrar'],
  ['Serveur','Server','Servidor','Server','Server','Servidor'],
  ['Utilisateur','Username','Usuario','Benutzername','Nome utente','Usuário'],
  ['Mot de passe','Password','Contraseña','Passwort','Password','Senha'],
  ['Mot de passe maître','Master password','Contraseña maestra','Master-Passwort','Password principale','Senha mestra'],
  ['Coffres','Vaults','Bóvedas','Tresore','Cassaforti','Cofres'],
  ['Déverrouillage','Unlock','Desbloqueo','Entsperren','Sblocco','Desbloqueio'],
  ['Biométrie','Biometrics','Biometría','Biometrie','Biometria','Biometria'],
  ['Code PIN','PIN','PIN','PIN-Code','Codice PIN','Código PIN'],
  ['Corbeille','Trash','Papelera','Papierkorb','Cestino','Lixeira'],
  ['Verrouiller maintenant','Lock now','Bloquear ahora','Jetzt sperren','Blocca ora','Bloquear agora'],
  ['Jamais','Never','Nunca','Nie','Mai','Nunca'],
  ['Activé','Enabled','Activado','Aktiviert','Attivo','Ativado'],
  ['Désactivé','Disabled','Desactivado','Deaktiviert','Disattivato','Desativado'],
  ['Reprendre','Resume','Reanudar','Fortsetzen','Riprendi','Retomar'],
  ['Lecture','Playback','Reproducción','Wiedergabe','Riproduzione','Reprodução'],
  ['Téléchargements','Downloads','Descargas','Downloads','Download','Downloads'],
  ['Recherche','Search','Búsqueda','Suche','Ricerca','Pesquisa'],
  ['Nouvel onglet','New tab','Nueva pestaña','Neuer Tab','Nuova scheda','Nova aba'],
  ['Commandes rapides','Quick commands','Comandos rápidos','Schnellbefehle','Comandi rapidi','Comandos rápidos'],
  ['Terminal','Terminal','Terminal','Terminal','Terminale','Terminal'],
  ['Connexions','Connections','Conexiones','Verbindungen','Connessioni','Conexões'],
  ['SSH et clés','SSH and keys','SSH y claves','SSH und Schlüssel','SSH e chiavi','SSH e chaves'],
  ['Shell local','Local shell','Shell local','Lokale Shell','Shell locale','Shell local'],
  ['Clavier','Keyboard','Teclado','Tastatur','Tastiera','Teclado'],
  ['Rappel','Reminder','Recordatorio','Erinnerung','Promemoria','Lembrete'],
  ['Calculs et jours fériés','Calculations and public holidays','Cálculos y festivos','Berechnungen und Feiertage','Calcoli e festività','Cálculos e feriados'],
  ['Heures sup.','Overtime','Horas extra','Überstunden','Straordinari','Horas extras'],
  ['Nuit','Night','Noche','Nacht','Notte','Noite'],
  ['Dimanche','Sunday','Domingo','Sonntag','Domenica','Domingo'],
  ['Jours fériés','Public holidays','Festivos','Feiertage','Festività','Feriados'],
  ['Texte','Text','Texto','Text','Testo','Texto'],
  ['Police des titres','Heading font','Fuente de títulos','Schrift für Überschriften','Carattere dei titoli','Fonte dos títulos'],
  ['Police du texte','Body font','Fuente del texto','Fließtext-Schrift','Carattere del testo','Fonte do texto'],
  ['Formes et mouvements','Shapes and motion','Formas y movimiento','Formen und Bewegung','Forme e movimenti','Formas e movimentos'],
  ['Coins','Corners','Esquinas','Ecken','Angoli','Cantos'],
  ['Arrondis','Rounded','Redondeados','Abgerundet','Arrotondati','Arredondados'],
  ['Très arrondis','Very rounded','Muy redondeados','Stark abgerundet','Molto arrotondati','Muito arredondados'],
  ['Densité','Density','Densidad','Dichte','Densità','Densidade'],
  ['Confortable','Comfortable','Cómoda','Komfortabel','Confortevole','Confortável'],
  ['Compacte','Compact','Compacta','Kompakt','Compatta','Compacta'],
  ['Aucun titre trouvé','No tracks found','No se encontraron pistas','Keine Titel gefunden','Nessun brano trovato','Nenhuma faixa encontrada'],
  ['Changer de serveur','Change server','Cambiar de servidor','Server wechseln','Cambia server','Trocar de servidor'],
  ['Mix aléatoire','Random mix','Mezcla aleatoria','Zufallsmix','Mix casuale','Mix aleatório'],
  ['Bibliothèque vide','Empty library','Biblioteca vacía','Leere Bibliothek','Libreria vuota','Biblioteca vazia'],
  ['Ajoutés récemment','Recently added','Añadidos recientemente','Kürzlich hinzugefügt','Aggiunti di recente','Adicionados recentemente'],
  ['Écoutés récemment','Recently played','Escuchados recientemente','Kürzlich angehört','Ascoltati di recente','Ouvidos recentemente'],
  ['Les plus écoutés','Most played','Los más escuchados','Am häufigsten gespielt','I più ascoltati','Mais ouvidos'],
  ['Au hasard','Random','Al azar','Zufällig','Casuale','Aleatório'],
  ['Tes favoris','Your favorites','Tus favoritos','Deine Favoriten','I tuoi preferiti','Seus favoritos'],
  ['Bienvenue','Welcome','Te damos la bienvenida','Willkommen','Benvenuto','Boas-vindas'],
  ['Connecte-toi à ton serveur Navidrome.','Connect to your Navidrome server.','Conéctate a tu servidor Navidrome.','Verbinde dich mit deinem Navidrome-Server.','Connettiti al tuo server Navidrome.','Conecte-se ao seu servidor Navidrome.'],
  ['Créer mon coffre','Create my vault','Crear mi bóveda','Tresor erstellen','Crea la mia cassaforte','Criar meu cofre'],
  ['Restaurer une sauvegarde','Restore a backup','Restaurar una copia de seguridad','Sicherung wiederherstellen','Ripristina un backup','Restaurar um backup'],
  ['gestionnaire de mots de passe','password manager','gestor de contraseñas','Passwortmanager','gestore di password','gerenciador de senhas'],
  ['Générateur','Generator','Generador','Generator','Generatore','Gerador'],
  ['Générer','Generate','Generar','Generieren','Genera','Gerar'],
  ['Verrouiller','Lock','Bloquear','Sperren','Blocca','Bloquear'],
  ['Déverrouiller','Unlock','Desbloquear','Entsperren','Sblocca','Desbloquear'],
  ['Nom du thème','Theme name','Nombre del tema','Themenname','Nome del tema','Nome do tema'],
  ['Personnaliser les couleurs','Customize colors','Personalizar colores','Farben anpassen','Personalizza i colori','Personalizar cores'],
  ['Importer un thème','Import a theme','Importar un tema','Thema importieren','Importa un tema','Importar um tema'],
  ['Supprimer ce thème','Delete this theme','Eliminar este tema','Dieses Thema löschen','Elimina questo tema','Excluir este tema'],
  ['Thème personnel','Custom theme','Tema personalizado','Benutzerdefiniertes Thema','Tema personalizzato','Tema personalizado'],
  ['Interface','Interface','Interfaz','Oberfläche','Interfaccia','Interface'],
  ['Couleur d’accent','Accent color','Color de acento','Akzentfarbe','Colore accento','Cor de destaque'],
  ['Accent qui suit le thème','Accent follows theme','El acento sigue el tema','Akzent folgt dem Thema','L’accento segue il tema','A cor de destaque acompanha o tema'],
  ['Marge autour du texte','Text margin','Margen del texto','Textabstand','Margine del testo','Margem ao redor do texto'],
  ['Position des onglets','Tab position','Posición de las pestañas','Position der Tabs','Posizione delle schede','Posição das abas'],
  ['En haut','Top','Arriba','Oben','In alto','Em cima'],
  ['En bas','Bottom','Abajo','Unten','In basso','Embaixo'],
  ['Onglet actif, boutons, touches CTRL/ALT…','Active tab, buttons, CTRL/ALT keys…','Pestaña activa, botones, teclas CTRL/ALT…','Aktiver Tab, Schaltflächen, STRG/ALT-Tasten…','Scheda attiva, pulsanti, tasti CTRL/ALT…','Aba ativa, botões, teclas CTRL/ALT…'],
  ['Écrivez, calculez et présentez.','Write, calculate, and present.','Escribe, calcula y presenta.','Schreiben, rechnen und präsentieren.','Scrivi, calcola e presenta.','Escreva, calcule e apresente.'],
  ['Tout reste sur vos appareils et se synchronise sans serveur.','Everything stays on your devices and syncs without a server.','Todo permanece en tus dispositivos y se sincroniza sin servidor.','Alles bleibt auf deinen Geräten und synchronisiert sich ohne Server.','Tutto resta sui tuoi dispositivi e si sincronizza senza server.','Tudo fica nos seus dispositivos e sincroniza sem servidor.'],
  ['Créer un document','Create a document','Crear un documento','Dokument erstellen','Crea un documento','Criar documento'],
  ['Paramètres','Settings','Configuración','Einstellungen','Impostazioni','Configurações'],
  ['Enregistrer les modifications','Save changes','Guardar cambios','Änderungen speichern','Salva modifiche','Salvar alterações'],
  ['Appliquer','Apply','Aplicar','Anwenden','Applica','Aplicar'],
  ['Précédent','Previous','Anterior','Zurück','Precedente','Anterior'],
  ['Suivant','Next','Siguiente','Weiter','Successivo','Próximo'],
  ['Actualiser','Refresh','Actualizar','Aktualisieren','Aggiorna','Atualizar'],
  ['État','Status','Estado','Status','Stato','Status'],
  ['Reconnecter','Reconnect','Volver a conectar','Erneut verbinden','Riconnetti','Reconectar'],
  ['Aperçu','Preview','Vista previa','Vorschau','Anteprima','Pré-visualização'],
  ['Principal','Primary','Principal','Primär','Primario','Principal'],
  ['Secondaire','Secondary','Secundario','Sekundär','Secondario','Secundário'],
  ['Système','System','Sistema','System','Sistema','Sistema'],
  ['Système (Roboto)','System (Roboto)','Sistema (Roboto)','System (Roboto)','Sistema (Roboto)','Sistema (Roboto)'],
  ['Exporter les données','Export data','Exportar datos','Daten exportieren','Esporta dati','Exportar dados'],
  ['Importer des données','Import data','Importar datos','Daten importieren','Importa dati','Importar dados'],
  ['Sauvegarder','Save backup','Crear copia de seguridad','Sicherung erstellen','Crea backup','Fazer backup'],
  ['Annuler les modifications','Discard changes','Descartar cambios','Änderungen verwerfen','Annulla modifiche','Descartar alterações'],
  ['Chargement…','Loading…','Cargando…','Wird geladen…','Caricamento…','Carregando…'],
  ['Réessayer','Retry','Reintentar','Erneut versuchen','Riprova','Tentar novamente'],
  ['Erreur','Error','Error','Fehler','Errore','Erro'],
  ['Langue enregistrée','Language saved','Idioma guardado','Sprache gespeichert','Lingua salvata','Idioma salvo'],
];

const APP_ROWS = [
  ['Disque','Drive','Unidad','Laufwerk','Disco','Disco'],
  ['Découvrir','Discover','Descubrir','Entdecken','Scopri','Descobrir'],
  ['Nouveautés','New releases','Novedades','Neuerscheinungen','Novità','Novidades'],
  ['Écoutes récentes','Recently played','Reproducciones recientes','Kürzlich angehört','Ascoltati di recente','Tocadas recentemente'],
  ['Les plus joués','Most played','Más reproducidos','Am häufigsten gespielt','Più riprodotti','Mais tocados'],
  ['Lire','Play','Reproducir','Abspielen','Riproduci','Reproduzir'],
  ['Pause','Pause','Pausar','Pause','Pausa','Pausar'],
  ['Suivant','Next','Siguiente','Weiter','Successivo','Próximo'],
  ['Précédent','Previous','Anterior','Zurück','Precedente','Anterior'],
  ['Aléatoire','Shuffle','Aleatorio','Zufällig','Casuale','Aleatório'],
  ['Répéter','Repeat','Repetir','Wiederholen','Ripeti','Repetir'],
  ['Égaliseur','Equalizer','Ecualizador','Equalizer','Equalizzatore','Equalizador'],
  ['Paroles','Lyrics','Letras','Liedtexte','Testi','Letras'],
  ['File d’attente','Queue','Cola','Warteschlange','Coda','Fila'],
  ['Ajouter à la file d’attente','Add to queue','Añadir a la cola','Zur Warteschlange hinzufügen','Aggiungi alla coda','Adicionar à fila'],
  ['Mode hors-ligne','Offline mode','Modo sin conexión','Offline-Modus','Modalità offline','Modo offline'],
  ['Titres','Tracks','Pistas','Titel','Brani','Faixas'],
  ['Pistes','Tracks','Pistas','Titel','Brani','Faixas'],
  ['Aucun album','No albums','No hay álbumes','Keine Alben','Nessun album','Nenhum álbum'],
  ['Aucun titre','No tracks','No hay pistas','Keine Titel','Nessun brano','Nenhuma faixa'],
  ['Changer de serveur','Change server','Cambiar de servidor','Server wechseln','Cambia server','Trocar de servidor'],
  ['Bienvenue','Welcome','Te damos la bienvenida','Willkommen','Benvenuto','Boas-vindas'],
  ['Coffre','Vault','Bóveda','Tresor','Cassaforte','Cofre'],
  ['Créer un coffre','Create a vault','Crear una bóveda','Tresor erstellen','Crea una cassaforte','Criar um cofre'],
  ['Créer mon coffre','Create my vault','Crear mi bóveda','Meinen Tresor erstellen','Crea la mia cassaforte','Criar meu cofre'],
  ['Déverrouiller','Unlock','Desbloquear','Entsperren','Sblocca','Desbloquear'],
  ['Mot de passe principal','Master password','Contraseña maestra','Master-Passwort','Password principale','Senha mestra'],
  ['Générateur','Generator','Generador','Generator','Generatore','Gerador'],
  ['Générer un mot de passe','Generate a password','Generar una contraseña','Passwort generieren','Genera una password','Gerar uma senha'],
  ['Identifiants','Logins','Credenciales','Anmeldedaten','Credenziali','Credenciais'],
  ['Carte bancaire','Payment card','Tarjeta bancaria','Zahlungskarte','Carta di pagamento','Cartão bancário'],
  ['Notes sécurisées','Secure notes','Notas seguras','Sichere Notizen','Note sicure','Notas seguras'],
  ['Aucun élément','No items','No hay elementos','Keine Einträge','Nessun elemento','Nenhum item'],
  ['Aucun élément pour l’instant.','No items yet.','Todavía no hay elementos.','Noch keine Einträge.','Ancora nessun elemento.','Nenhum item ainda.'],
  ['Créer un élément','Create item','Crear elemento','Eintrag erstellen','Crea elemento','Criar item'],
  ['Nouveau mot de passe','New password','Nueva contraseña','Neues Passwort','Nuova password','Nova senha'],
  ['Remplissage automatique','Autofill','Autorrelleno','Automatisches Ausfüllen','Compilazione automatica','Preenchimento automático'],
  ['Verrouillage automatique','Auto-lock','Bloqueo automático','Automatische Sperre','Blocco automatico','Bloqueio automático'],
  ['Confidentialité','Privacy','Privacidad','Datenschutz','Privacy','Privacidade'],
  ['Presse-papiers','Clipboard','Portapapeles','Zwischenablage','Appunti','Área de transferência'],
  ['Nouvelle mission','New job','Nueva misión','Neuer Auftrag','Nuova missione','Nova missão'],
  ['Modifier la mission','Edit job','Editar misión','Auftrag bearbeiten','Modifica missione','Editar missão'],
  ['Début','Start','Inicio','Beginn','Inizio','Início'],
  ['Fin','End','Fin','Ende','Fine','Fim'],
  ['Pause','Break','Pausa','Pause','Pausa','Intervalo'],
  ['Heures travaillées','Hours worked','Horas trabajadas','Arbeitsstunden','Ore lavorate','Horas trabalhadas'],
  ['Heures supplémentaires','Overtime','Horas extra','Überstunden','Straordinari','Horas extras'],
  ['Jour férié','Public holiday','Festivo','Feiertag','Festivo','Feriado'],
  ['Montant estimé','Estimated amount','Importe estimado','Geschätzter Betrag','Importo stimato','Valor estimado'],
  ['Taux horaire','Hourly rate','Tarifa por hora','Stundenlohn','Tariffa oraria','Valor por hora'],
  ['Panier repas','Meal allowance','Plus de comida','Essenspauschale','Indennità pasto','Auxílio-alimentação'],
  ['Indemnités','Allowances','Indemnizaciones','Zulagen','Indennità','Adicionais'],
  ['Ajouter des heures','Add hours','Añadir horas','Stunden hinzufügen','Aggiungi ore','Adicionar horas'],
  ['Choisir une date','Choose a date','Elegir una fecha','Datum auswählen','Scegli una data','Escolher uma data'],
  ['Données et sauvegarde','Data and backup','Datos y copia de seguridad','Daten und Sicherung','Dati e backup','Dados e backup'],
  ['Exporter PDF','Export PDF','Exportar PDF','PDF exportieren','Esporta PDF','Exportar PDF'],
  ['Aujourd’hui','Today','Hoy','Heute','Oggi','Hoje'],
  ['Bonne nuit','Good evening','Buenas noches','Gute Nacht','Buona notte','Boa noite'],
  ['Bonjour','Good morning','Buenos días','Guten Morgen','Buongiorno','Bom dia'],
  ['Bon après-midi','Good afternoon','Buenas tardes','Guten Tag','Buon pomeriggio','Boa tarde'],
  ['Bonsoir','Good evening','Buenas tardes','Guten Abend','Buonasera','Boa noite'],
  ['Nouveau document','New document','Nuevo documento','Neues Dokument','Nuovo documento','Novo documento'],
  ['Document vierge','Blank document','Documento en blanco','Leeres Dokument','Documento vuoto','Documento em branco'],
  ['Nouveau classeur','New spreadsheet','Nueva hoja de cálculo','Neue Tabelle','Nuovo foglio di calcolo','Nova planilha'],
  ['Nouvelle présentation','New presentation','Nueva presentación','Neue Präsentation','Nuova presentazione','Nova apresentação'],
  ['Rechercher dans les documents','Search documents','Buscar documentos','Dokumente durchsuchen','Cerca documenti','Pesquisar documentos'],
  ['Aucun fichier pour l’instant.','No files yet.','Todavía no hay archivos.','Noch keine Dateien.','Nessun file per ora.','Nenhum arquivo por enquanto.'],
  ['Sans titre','Untitled','Sin título','Unbenannt','Senza titolo','Sem título'],
  ['Renommer','Rename','Cambiar nombre','Umbenennen','Rinomina','Renomear'],
  ['Dupliquer','Duplicate','Duplicar','Duplizieren','Duplica','Duplicar'],
  ['Tout supprimer','Delete all','Eliminar todo','Alles löschen','Elimina tutto','Excluir tudo'],
  ['Arrière-plan','Background','Fondo','Hintergrund','Sfondo','Plano de fundo'],
  ['Affichage des fichiers','File display','Visualización de archivos','Dateianzeige','Visualizzazione file','Exibição de arquivos'],
  ['Trier par','Sort by','Ordenar por','Sortieren nach','Ordina per','Ordenar por'],
  ['Confirmer avant de supprimer','Confirm before deleting','Confirmar antes de eliminar','Vor dem Löschen bestätigen','Conferma prima di eliminare','Confirmar antes de excluir'],
  ['Terminal','Terminal','Terminal','Terminal','Terminale','Terminal'],
  ['Shell local','Local shell','Shell local','Lokale Shell','Shell locale','Shell local'],
  ['SSH et clés','SSH and keys','SSH y claves','SSH und Schlüssel','SSH e chiavi','SSH e chaves'],
  ['Clé privée','Private key','Clave privada','Privater Schlüssel','Chiave privata','Chave privada'],
  ['Ouvrir une connexion','Open connection','Abrir conexión','Verbindung öffnen','Apri connessione','Abrir conexão'],
  ['Créer une connexion','Create connection','Crear conexión','Verbindung erstellen','Crea connessione','Criar conexão'],
  ['Déconnecter','Disconnect','Desconectar','Trennen','Disconnetti','Desconectar'],
  ['Hôte','Host','Host','Host','Host','Host'],
  ['Port','Port','Puerto','Port','Porta','Porta'],
  ['Copier','Copy','Copiar','Kopieren','Copia','Copiar'],
  ['Coller','Paste','Pegar','Einfügen','Incolla','Colar'],
  ['Effacer','Clear','Borrar','Löschen','Cancella','Limpar'],
  ['Rechercher dans le terminal','Search terminal','Buscar en el terminal','Terminal durchsuchen','Cerca nel terminale','Pesquisar no terminal'],
  ['Touches supplémentaires','Extra keys','Teclas adicionales','Zusatztasten','Tasti aggiuntivi','Teclas extras'],
  ['Afficher le test des couleurs','Show color test','Mostrar prueba de colores','Farbtest anzeigen','Mostra test colori','Mostrar teste de cores'],
  ['Paramètres du coffre','Vault settings','Ajustes de la bóveda','Tresoreinstellungen','Impostazioni cassaforte','Configurações do cofre'],
  ['Importer / Exporter','Import / Export','Importar / Exportar','Importieren / Exportieren','Importa / Esporta','Importar / Exportar'],
  ['Pas de données à afficher','No data to display','No hay datos que mostrar','Keine Daten zum Anzeigen','Nessun dato da visualizzare','Nenhum dado para exibir'],
  ['Chargement…','Loading…','Cargando…','Wird geladen…','Caricamento…','Carregando…'],
  ['Serveur injoignable','Server unreachable','Servidor inaccesible','Server nicht erreichbar','Server non raggiungibile','Servidor inacessível'],
  ['Aperçus','Previews','Vistas previas','Vorschauen','Anteprime','Pré-visualizações'],
  ['Mode tabletop / livre','Tabletop / book mode','Modo mesa / libro','Tisch-/Buchmodus','Modalità tabletop / libro','Modo mesa / livro'],
  // Extra Fable screen strings
  ["Exemple chargé : explore, puis supprime-le quand tu veux.","Example loaded: explore it, then delete it whenever you like.","Ejemplo cargado: explóralo y bórralo cuando quieras.","Beispiel geladen: Probiere es aus und lösche es später.","Esempio caricato: esploralo e poi eliminalo quando vuoi.","Exemplo carregado: explore e exclua quando quiser."],
  ["Ajouter une journée","Add a day","Añadir un día","Tag hinzufügen","Aggiungi una giornata","Adicionar um dia"],
  ["En pause","Paused","En pausa","Pausiert","In pausa","Em pausa"],
  ["En cours","In progress","En curso","Läuft","In corso","Em andamento"],
  ["Moins d’une minute : rien à enregistrer.","Less than a minute: nothing to save.","Menos de un minuto: nada que guardar.","Weniger als eine Minute: nichts zu speichern.","Meno di un minuto: niente da salvare.","Menos de um minuto: nada para salvar."],
  ["Journée enregistrée. Ajuste si besoin.","Day saved. Adjust it if needed.","Día guardado. Ajústalo si es necesario.","Tag gespeichert. Passe ihn bei Bedarf an.","Giornata salvata. Modifica se necessario.","Dia salvo. Ajuste se necessário."],
  ["Annuler le pointage ?","Cancel the time entry?","¿Cancelar el registro?","Zeiterfassung abbrechen?","Annullare la registrazione?","Cancelar o registro?"],
  ["Le temps en cours ne sera pas enregistré.","The current time won't be saved.","El tiempo actual no se guardará.","Die aktuelle Zeit wird nicht gespeichert.","Il tempo attuale non verrà salvato.","O tempo atual não será salvo."],
  ["Annuler le pointage","Cancel time entry","Cancelar registro","Zeiterfassung abbrechen","Annulla registrazione","Cancelar registro"],
  ["Journée","Day","Día","Tag","Giornata","Dia"],
  ["Nouvelle journée","New day","Nuevo día","Neuer Tag","Nuova giornata","Novo dia"],
  ["Modifier la journée","Edit day","Editar día","Tag bearbeiten","Modifica giornata","Editar dia"],
  ["Enregistrer la journée","Save day","Guardar día","Tag speichern","Salva giornata","Salvar dia"],
  ["Choisir une date","Choose a date","Elegir una fecha","Datum auswählen","Scegli una data","Escolher uma data"],
  ["Le panier repas est désactivé pour cette mission.","Meal allowance is disabled for this job.","La asignación de comida está desactivada para esta misión.","Essenspauschale ist für diesen Auftrag deaktiviert.","L'indennità pasto è disattivata per questa missione.","O auxílio-alimentação está desativado para esta missão."],
  ["chaque jour travaillé","each working day","cada día trabajado","jeden Arbeitstag","ogni giorno lavorato","cada dia trabalhado"],
  ["Panier compté ce jour, quelle que soit la durée.","Meal allowance counted for this day, regardless of duration.","La comida se cuenta este día, sin importar la duración.","Essenspauschale wird für diesen Tag unabhängig von der Dauer angerechnet.","Indennità pasto conteggiata per il giorno, indipendentemente dalla durata.","Auxílio-alimentação contado neste dia, independentemente da duração."],
  ["Pas de panier ce jour.","No meal allowance today.","Sin comida hoy.","Heute keine Essenspauschale.","Nessuna indennità pasto oggi.","Sem auxílio-alimentação hoje."],
  ["Plus de 13 h travaillées : vérifie les horaires.","More than 13 hours worked: check the times.","Más de 13 horas trabajadas: revisa los horarios.","Mehr als 13 Stunden gearbeitet: Zeiten prüfen.","Oltre 13 ore lavorate: verifica gli orari.","Mais de 13 horas trabalhadas: verifique os horários."],
  ["Date ou horaires invalides.","Invalid date or times.","Fecha u horarios no válidos.","Ungültiges Datum oder ungültige Uhrzeiten.","Data o orari non validi.","Data ou horários inválidos."],
  ["La pause est plus longue que la journée.","The break is longer than the workday.","La pausa es más larga que la jornada.","Die Pause ist länger als der Arbeitstag.","La pausa è più lunga della giornata lavorativa.","O intervalo é maior que a jornada."],
  ["Journée enregistrée","Day saved","Día guardado","Tag gespeichert","Giornata salvata","Dia salvo"],
  ["Modifications enregistrées","Changes saved","Cambios guardados","Änderungen gespeichert","Modifiche salvate","Alterações salvas"],
  ["Supprimer cette journée ?","Delete this day?","¿Eliminar este día?","Diesen Tag löschen?","Eliminare questa giornata?","Excluir este dia?"],
  ["Journée supprimée","Day deleted","Día eliminado","Tag gelöscht","Giornata eliminata","Dia excluído"],
  ["Dupliquer la journée","Duplicate day","Duplicar día","Tag duplizieren","Duplica giornata","Duplicar dia"],
  ["Mois précédent","Previous month","Mes anterior","Vorheriger Monat","Mese precedente","Mês anterior"],
  ["Mois suivant","Next month","Mes siguiente","Nächster Monat","Mese successivo","Próximo mês"],
  ["Choisir un mois","Choose a month","Elegir un mes","Monat auswählen","Scegli un mese","Escolher um mês"],
  ["Toutes les missions","All jobs","Todas las misiones","Alle Aufträge","Tutte le missioni","Todas as missões"],
  ["Archivée","Archived","Archivada","Archiviert","Archiviata","Arquivada"],
  ["Aucune journée ce mois-ci","No days this month","No hay días este mes","Keine Tage in diesem Monat","Nessuna giornata questo mese","Nenhum dia neste mês"],
  ["Ajoute une journée avec le bouton +, ou lance la pointeuse depuis l’accueil.","Add a day using the + button, or start the timer from Home.","Añade un día con el botón + o inicia el cronómetro desde Inicio.","Füge mit + einen Tag hinzu oder starte die Zeiterfassung auf der Startseite.","Aggiungi una giornata con + oppure avvia il timer dalla Home.","Adicione um dia com + ou inicie o cronômetro na página inicial."],
  ["Jours travaillés","Days worked","Días trabajados","Arbeitstage","Giorni lavorati","Dias trabalhados"],
  ["Heures de nuit","Night hours","Horas nocturnas","Nachtstunden","Ore notturne","Horas noturnas"],
  ["Salaire brut","Gross pay","Salario bruto","Bruttolohn","Retribuzione lorda","Salário bruto"],
  ["Indemnité de fin de contrat","End-of-contract compensation","Indemnización de fin de contrato","Vertragsendvergütung","Indennità di fine contratto","Indenização de fim de contrato"],
  ["Indemnité de fin de mission (IFM)","End-of-assignment compensation (IFM)","Indemnización de fin de misión (IFM)","Einsatzendvergütung (IFM)","Indennità di fine missione (IFM)","Indenização de fim de missão (IFM)"],
  ["Prime de fin de contrat","End-of-contract bonus","Prima de fin de contrato","Vertragsabschlussprämie","Premio di fine contratto","Prêmio de fim de contrato"],
  ["Fin de mission / contrat","End of assignment / contract","Fin de misión / contrato","Ende des Einsatzes / Vertrags","Fine missione / contratto","Fim de missão / contrato"],
  ["Total brut estimé","Estimated gross total","Total bruto estimado","Geschätzte Bruttosumme","Totale lordo stimato","Total bruto estimado"],
  ["Net estimé","Estimated net","Neto estimado","Geschätzter Nettobetrag","Netto stimato","Líquido estimado"],
  ["Comment c’est calculé","How it is calculated","Cómo se calcula","So wird es berechnet","Come viene calcolato","Como é calculado"],
  ["Rien à exporter sur cette période.","Nothing to export for this period.","No hay nada que exportar en este período.","Für diesen Zeitraum gibt es nichts zu exportieren.","Niente da esportare per questo periodo.","Nada para exportar neste período."],
  ["Relevé d’heures prêt à envoyer ou imprimer","Timesheet ready to send or print","Registro de horas listo para enviar o imprimir","Stundennachweis zum Senden oder Drucken bereit","Foglio ore pronto da inviare o stampare","Folha de horas pronta para enviar ou imprimir"],
  ["Journées + résumé, montants en nombres","Days + summary, amounts as numbers","Días + resumen, importes como números","Tage + Zusammenfassung, Beträge als Zahlen","Giornate + riepilogo, importi come numeri","Dias + resumo, valores numéricos"],
  ["Pour Google Sheets, LibreOffice…","For Google Sheets, LibreOffice…","Para Google Sheets, LibreOffice…","Für Google Sheets, LibreOffice…","Per Google Sheets, LibreOffice…","Para Google Sheets, LibreOffice…"],
  ["Préparation du fichier…","Preparing file…","Preparando archivo…","Datei wird vorbereitet…","Preparazione del file…","Preparando arquivo…"],
  ["Mission sans nom","Unnamed job","Misión sin nombre","Auftrag ohne Namen","Missione senza nome","Missão sem nome"],
  ["Taux horaire à renseigner","Hourly rate required","Debes indicar la tarifa por hora","Stundenlohn erforderlich","Tariffa oraria da inserire","Informe o valor por hora"],
  ["Nouvelle mission","New job","Nueva misión","Neuer Auftrag","Nuova missione","Nova missão"],
  ["Aucune mission","No jobs","No hay misiones","Keine Aufträge","Nessuna missione","Nenhuma missão"],
  ["Une mission = un employeur ou une agence, avec son taux horaire et ses majorations.","A job represents an employer or agency with its hourly rate and premiums.","Una misión representa a una empresa o agencia, con su tarifa y recargos.","Ein Auftrag steht für Arbeitgeber oder Agentur mit Stundenlohn und Zuschlägen.","Una missione rappresenta un datore di lavoro o un'agenzia con tariffa e maggiorazioni.","Uma missão representa um empregador ou agência, com valor por hora e adicionais."],
  ["Créer une mission","Create job","Crear misión","Auftrag erstellen","Crea missione","Criar missão"],
  ["Nom de la mission","Job name","Nombre de la misión","Auftragsname","Nome missione","Nome da missão"],
  ["Ex. : Agent de quai — Manpower","Example: Warehouse worker — agency","Ej.: Operario de muelle — agencia","Z. B.: Lagerarbeiter — Agentur","Es.: Addetto al magazzino — agenzia","Ex.: Auxiliar de armazém — agência"],
  ["Taux horaire brut","Gross hourly rate","Tarifa bruta por hora","Bruttostundenlohn","Tariffa oraria lorda","Valor bruto por hora"],
  ["Travail de nuit","Night work","Trabajo nocturno","Nachtarbeit","Lavoro notturno","Trabalho noturno"],
  ["Heures dans une plage horaire","Hours within a time window","Horas en una franja horaria","Stunden innerhalb eines Zeitfensters","Ore in una fascia oraria","Horas dentro de um intervalo"],
  ["Travail le dimanche","Sunday work","Trabajo en domingo","Sonntagsarbeit","Lavoro domenicale","Trabalho aos domingos"],
  ["Majoration des heures du dimanche","Sunday hours premium","Recargo por horas de domingo","Sonntagszuschlag","Maggiorazione domenicale","Adicional de horas aos domingos"],
  ["Calendrier Alsace-Moselle","Alsace-Moselle calendar","Calendario de Alsacia-Mosela","Kalender Elsass-Mosel","Calendario Alsazia-Mosella","Calendário Alsácia-Mosela"],
  ["Calendrier France (Paris)","France calendar (Paris)","Calendario de Francia (París)","Kalender Frankreich (Paris)","Calendario Francia (Parigi)","Calendário da França (Paris)"],
  ["Panier repas","Meal allowance","Plus de comida","Essenspauschale","Indennità pasto","Auxílio-alimentação"],
  ["Indemnité repas","Meal allowance","Compensación de comida","Essenszulage","Indennità pasto","Auxílio-refeição"],
  ["Indemnité de trajet","Travel allowance","Compensación de transporte","Fahrtkostenzulage","Indennità di viaggio","Auxílio de deslocamento"],
  ["Montant fixe par jour travaillé","Fixed amount per working day","Importe fijo por día trabajado","Fester Betrag pro Arbeitstag","Importo fisso per giornata lavorativa","Valor fixo por dia trabalhado"],
  ["Sur le brut de la période","On gross pay for the period","Sobre el bruto del período","Auf den Bruttolohn des Zeitraums","Sul lordo del periodo","Sobre o bruto do período"],
  ["Congés payés (ICCP)","Paid leave compensation (ICCP)","Compensación de vacaciones (ICCP)","Urlaubsabgeltung (ICCP)","Indennità ferie (ICCP)","Compensação de férias (ICCP)"],
  ["Indemnité compensatrice","Compensation allowance","Indemnización compensatoria","Ausgleichszahlung","Indennità compensativa","Indenização compensatória"],
  ["Période de paie","Pay period","Período de pago","Abrechnungszeitraum","Periodo di paga","Período de pagamento"],
  ["Mois complet","Full month","Mes completo","Voller Monat","Mese intero","Mês completo"],
  ["Horaires et pause par défaut","Default hours and break","Horario y pausa predeterminados","Standardzeiten und Pause","Orari e pausa predefiniti","Horários e intervalo padrão"],
  ["Cumul des majorations","Premium calculation","Acumulación de recargos","Zuschlagsberechnung","Calcolo delle maggiorazioni","Cálculo dos adicionais"],
  ["La plus forte","Highest only","Solo la más alta","Nur der höchste Zuschlag","Solo la più alta","Somente o maior"],
  ["Additionnées","Added together","Sumadas","Addiert","Sommate","Somadas"],
  ["Réactiver la mission","Reactivate job","Reactivar misión","Auftrag reaktivieren","Riattiva missione","Reativar missão"],
  ["Archiver la mission","Archive job","Archivar misión","Auftrag archivieren","Archivia missione","Arquivar missão"],
  ["Elle réapparaîtra dans la pointeuse et la saisie","It will reappear in the timer and entries","Volverá a aparecer en el cronómetro y los registros","Erscheint wieder in Timer und Erfassung","Riapparirà nel timer e nelle registrazioni","Ela reaparecerá no cronômetro e nos registros"],
  ["Masquée de la pointeuse, journées conservées","Hidden from timer; days are kept","Oculta del cronómetro, se conservan los días","Im Timer verborgen, Tage bleiben erhalten","Nascosta dal timer, giornate conservate","Oculta do cronômetro, dias preservados"],
  ["Et toutes ses journées","And all its days","Y todos sus días","Und alle zugehörigen Tage","E tutte le sue giornate","E todos os seus dias"],
  ["Donne un nom à la mission.","Give the job a name.","Pon un nombre a la misión.","Gib dem Auftrag einen Namen.","Dai un nome alla missione.","Dê um nome à missão."],
  ["Mission créée","Job created","Misión creada","Auftrag erstellt","Missione creata","Missão criada"],
  ["Mission créée — pense au taux horaire pour voir les montants","Job created — enter an hourly rate to see amounts","Misión creada: indica la tarifa por hora para ver importes","Auftrag erstellt — gib einen Stundenlohn ein, um Beträge zu sehen","Missione creata: inserisci la tariffa oraria per vedere gli importi","Missão criada — informe o valor por hora para ver os valores"],
  ["Mission archivée","Job archived","Misión archivada","Auftrag archiviert","Missione archiviata","Missão arquivada"],
  ["Mission réactivée","Job reactivated","Misión reactivada","Auftrag reaktiviert","Missione riattivata","Missão reativada"],
  ["Aucune journée enregistrée pour cette mission.","No days recorded for this job.","No hay días registrados para esta misión.","Keine Tage für diesen Auftrag erfasst.","Nessuna giornata registrata per questa missione.","Nenhum dia registrado para esta missão."],
  ["Mission supprimée","Job deleted","Misión eliminada","Auftrag gelöscht","Missione eliminata","Missão excluída"],
  ["Selon le jour de début","Based on start day","Según el día de inicio","Nach Starttag","In base al giorno di inizio","Conforme o dia de início"],
  ["Heure par heure","Hour by hour","Hora por hora","Stunde für Stunde","Ora per ora","Hora a hora"],
  ["Activer les heures sup.","Enable overtime","Activar horas extra","Überstunden aktivieren","Attiva straordinari","Ativar horas extras"],
  ["Par semaine","Per week","Por semana","Pro Woche","A settimana","Por semana"],
  ["Par jour","Per day","Por día","Pro Tag","Al giorno","Por dia"],
  ["À partir de","Starting at","A partir de","Ab","A partire da","A partir de"],
  ["Palier 2","Tier 2","Nivel 2","Stufe 2","Livello 2","Faixa 2"],
  ["Repère : sans accord d’entreprise, +25 % de la 36ᵉ à la 43ᵉ heure, puis +50 %. Un accord peut prévoir un autre taux (10 % minimum).","Reference: without a company agreement, +25% from the 36th to 43rd hour, then +50%. An agreement may set another rate (10% minimum).","Referencia: sin convenio de empresa, +25 % de la hora 36 a la 43 y luego +50 %. Un acuerdo puede fijar otro porcentaje (mínimo del 10 %).","Richtwert: Ohne Betriebsvereinbarung +25 % von der 36. bis zur 43. Stunde, danach +50 %. Eine Vereinbarung kann einen anderen Satz vorsehen (mindestens 10 %).","Riferimento: senza accordo aziendale, +25% dalla 36ª alla 43ª ora, poi +50%. Un accordo può prevedere un'altra aliquota (minimo 10%).","Referência: sem acordo empresarial, +25% da 36ª à 43ª hora e depois +50%. Um acordo pode prever outra taxa (mínimo de 10%)."],
  ["L’appli détecte automatiquement les heures comprises dans cette plage.","The app automatically detects hours within this range.","La aplicación detecta automáticamente las horas de esta franja.","Die App erkennt automatisch Stunden in diesem Zeitraum.","L'app rileva automaticamente le ore in questa fascia.","O app detecta automaticamente as horas neste intervalo."],
  // Extra Fable screen strings 2
  ["Personnalisation","Customization","Personalización","Personalisierung","Personalizzazione","Personalização"],
  ["Couleurs, thème, polices, taille, coins","Colors, theme, fonts, size, corners","Colores, tema, fuentes, tamaño y esquinas","Farben, Design, Schriftarten, Größe, Ecken","Colori, tema, caratteri, dimensione, angoli","Cores, tema, fontes, tamanho e cantos"],
  ["Affichage","Display","Visualización","Anzeige","Visualizzazione","Exibição"],
  ["Calculs et jours fériés","Calculations and public holidays","Cálculos y festivos","Berechnungen und Feiertage","Calcoli e festività","Cálculos e feriados"],
  ["Rappel","Reminder","Recordatorio","Erinnerung","Promemoria","Lembrete"],
  ["Données et sauvegarde","Data and backup","Datos y copia de seguridad","Daten und Sicherung","Dati e backup","Dados e backup"],
  ["Les majorations, paniers, indemnités et horaires se règlent mission par mission, dans l’onglet Missions.","Premiums, allowances, and hours are configured per job in the Jobs tab.","Los recargos, dietas, indemnizaciones y horarios se configuran por misión en la pestaña Misiones.","Zuschläge, Pauschalen, Entschädigungen und Zeiten werden je Auftrag im Tab Aufträge eingestellt.","Maggiorazioni, indennità e orari si configurano per missione nella scheda Missioni.","Adicionais, auxílios e horários são configurados por missão na aba Missões."],
  ["Noir","Black","Negro","Schwarz","Nero","Preto"],
  ["Noir (AMOLED)","Black (AMOLED)","Negro (AMOLED)","Schwarz (AMOLED)","Nero (AMOLED)","Preto (AMOLED)"],
  ["Couleur principale","Main color","Color principal","Hauptfarbe","Colore principale","Cor principal"],
  ["Couleurs des majorations","Overtime colors","Colores de recargos","Zuschlagsfarben","Colori delle maggiorazioni","Cores dos adicionais"],
  ["Police des titres","Heading font","Fuente de títulos","Schrift für Überschriften","Carattere dei titoli","Fonte dos títulos"],
  ["Police du texte","Body font","Fuente del texto","Fließtext-Schrift","Carattere del testo","Fonte do texto"],
  ["Formes et mouvements","Shapes and motion","Formas y movimiento","Formen und Bewegung","Forme e movimenti","Formas e movimentos"],
  ["Coins","Corners","Esquinas","Ecken","Angoli","Cantos"],
  ["Arrondis","Rounded","Redondeados","Abgerundet","Arrotondati","Arredondados"],
  ["Très arrondis","Very rounded","Muy redondeados","Stark abgerundet","Molto arrotondati","Muito arredondados"],
  ["Confortable","Comfortable","Cómodo","Komfortabel","Confortevole","Confortável"],
  ["Compacte","Compact","Compacto","Kompakt","Compatta","Compacta"],
  ["Animations","Animations","Animaciones","Animationen","Animazioni","Animações"],
  ["Vibrations","Haptics","Vibraciones","Vibrationen","Vibrazioni","Vibrações"],
  ["Réinitialiser l’apparence","Reset appearance","Restablecer apariencia","Erscheinungsbild zurücksetzen","Reimposta aspetto","Redefinir aparência"],
  ["Réinitialiser l’apparence ?","Reset appearance?","¿Restablecer la apariencia?","Erscheinungsbild zurücksetzen?","Reimpostare l'aspetto?","Redefinir a aparência?"],
  ["Couleurs, thème, polices, taille, coins et animations reviennent aux réglages d’origine. Tes données ne bougent pas.","Colors, theme, fonts, size, corners, and animations will return to defaults. Your data won't change.","Los colores, el tema, las fuentes, el tamaño, las esquinas y las animaciones volverán a los valores predeterminados. Tus datos no cambiarán.","Farben, Design, Schriftarten, Größe, Ecken und Animationen werden zurückgesetzt. Deine Daten bleiben erhalten.","Colori, tema, caratteri, dimensione, angoli e animazioni torneranno ai valori iniziali. I dati non cambiano.","Cores, tema, fontes, tamanho, cantos e animações voltarão ao padrão. Seus dados não serão alterados."],
  ["Démarrage sur","Start on","Iniciar en","Starten bei","Avvia su","Iniciar em"],
  ["Montants masqués","Amounts hidden","Importes ocultos","Beträge ausgeblendet","Importi nascosti","Valores ocultos"],
  ["Cotisations","Contributions","Cotizaciones","Beiträge","Contributi","Contribuições"],
  ["France (Paris)","France (Paris)","Francia (París)","Frankreich (Paris)","Francia (Parigi)","França (Paris)"],
  ["Alsace-Moselle","Alsace-Moselle","Alsacia-Mosela","Elsass-Mosel","Alsazia-Mosella","Alsácia-Mosela"],
  ["Activé à","Enabled at","Activado a las","Aktiviert um","Attivo alle","Ativado às"],
  ["Désactivé","Disabled","Desactivado","Deaktiviert","Disattivato","Desativado"],
  ["Données exportées","Data exported","Datos exportados","Daten exportiert","Dati esportati","Dados exportados"],
  ["Importer une sauvegarde","Import a backup","Importar copia de seguridad","Sicherung importieren","Importa un backup","Importar backup"],
  ["Exporter les données","Export data","Exportar datos","Daten exportieren","Esporta dati","Exportar dados"],
  ["Restaurer les données","Restore data","Restaurar datos","Daten wiederherstellen","Ripristina dati","Restaurar dados"],
  ["Sauvegarde restaurée","Backup restored","Copia restaurada","Sicherung wiederhergestellt","Backup ripristinato","Backup restaurado"],
  ["Aucune sauvegarde disponible","No backup available","No hay copias disponibles","Keine Sicherung verfügbar","Nessun backup disponibile","Nenhum backup disponível"],
  ["Supprimer toutes les données","Delete all data","Eliminar todos los datos","Alle Daten löschen","Elimina tutti i dati","Excluir todos os dados"],
  ["Confirmer la suppression","Confirm deletion","Confirmar eliminación","Löschen bestätigen","Conferma eliminazione","Confirmar exclusão"],
  ["Créer une journée","Create a day","Crear un día","Tag erstellen","Crea una giornata","Criar um dia"],
  ["Choisir une mission","Choose a job","Elegir una misión","Auftrag auswählen","Scegli una missione","Escolher uma missão"],
  ["Aucune mission active","No active jobs","No hay misiones activas","Keine aktiven Aufträge","Nessuna missione attiva","Nenhuma missão ativa"],
  ["Aucune journée enregistrée","No days recorded","No hay días registrados","Keine Tage erfasst","Nessuna giornata registrata","Nenhum dia registrado"],
  ["Ajouter une mission","Add a job","Añadir una misión","Auftrag hinzufügen","Aggiungi missione","Adicionar missão"],
  ["Exporter PDF","Export PDF","Exportar PDF","PDF exportieren","Esporta PDF","Exportar PDF"],
  ["Exporter Excel","Export Excel","Exportar Excel","Excel exportieren","Esporta Excel","Exportar Excel"],
  ["Exporter CSV","Export CSV","Exportar CSV","CSV exportieren","Esporta CSV","Exportar CSV"],
  ["Jours fériés","Public holidays","Festivos","Feiertage","Festività","Feriados"],
  ["Activer le rappel","Enable reminder","Activar recordatorio","Erinnerung aktivieren","Attiva promemoria","Ativar lembrete"],
  ["Heure du rappel","Reminder time","Hora del recordatorio","Erinnerungszeit","Orario promemoria","Horário do lembrete"],
  ["Tester le rappel","Test reminder","Probar recordatorio","Erinnerung testen","Prova promemoria","Testar lembrete"],
  ["Rappel désactivé","Reminder disabled","Recordatorio desactivado","Erinnerung deaktiviert","Promemoria disattivato","Lembrete desativado"],
  ["Impossible d’importer ce fichier","Unable to import this file","No se puede importar este archivo","Diese Datei kann nicht importiert werden","Impossibile importare questo file","Não foi possível importar este arquivo"],
  ["Format non pris en charge","Unsupported format","Formato no compatible","Nicht unterstütztes Format","Formato non supportato","Formato não compatível"],
  ["Aperçu","Preview","Vista previa","Vorschau","Anteprima","Pré-visualização"],
  ["Principal","Primary","Principal","Primär","Primario","Principal"],
  ["Secondaire","Secondary","Secundario","Sekundär","Secondario","Secundário"],
  ["Réinitialiser","Reset","Restablecer","Zurücksetzen","Reimposta","Redefinir"],
  ["Données conservées","Data preserved","Datos conservados","Daten erhalten","Dati conservati","Dados preservados"],
];

const DICT = new Map([...ROWS, ...APP_ROWS].map((row) => [row[0], Object.fromEntries(LOCALES.map((l, i) => [l.code, i === 0 ? row[0] : (row[i] || row[0])]))]));
const ORDERED = ROWS.slice().sort((a, b) => b[0].length - a[0].length);
const TEXT_STATE = new WeakMap();
const ATTR_STATE = new WeakMap();
let initialized = false;
let locale = 'fr';
let observer = null;
let exclusions = [];
let sourceToLocalized = null;

function escapeRegExp(value) {
  return value.replace(/[.*+?^$()|[\]\\]/g, '\\$&');
}

function excluded(element) {
  if (!element || element.nodeType !== 1) return false;
  const selectors = ['script','style','noscript','textarea','input','code','pre','[contenteditable="true"]','[data-no-translate]','.xterm','.xterm-screen','.xterm-rows','.terminal-output','.command-output','.doc-page','.sheet-cell','.sheet-grid','.slides-canvas','.slide-content','.ProseMirror','.tiptap','.editor-content','.credential-name','.secret-value','.passphrase','.item-title','.item-subtitle','.vault-name','.doc-title','.mission-name','.mission-title','.entry-note','.user-text','.song-title','.artist-name','.album-title','.playlist-name','.track-title'].concat(exclusions);
  try { return !!element.closest(selectors.join(',')); } catch { return false; }
}

function capitalizeLike(source, target) {
  if (!source || !target) return target;
  const first = source.charAt(0);
  if (first && first === first.toLowerCase() && first !== first.toUpperCase()) return target.charAt(0).toLowerCase() + target.slice(1);
  return target;
}

function translateText(source, targetLocale) {
  const value = String(source || '');
  if (targetLocale === 'fr' || !value.trim()) return value;
  const leading = (value.match(/^\s*/) || [''])[0];
  const trailing = (value.match(/\s*$/) || [''])[0];
  const trimmed = value.slice(leading.length, value.length - trailing.length);
  const exact = DICT.get(trimmed);
  if (exact) return leading + (exact[targetLocale] || trimmed) + trailing;

  let output = trimmed;
  for (const row of ORDERED) {
    const key = row[0];
    const target = DICT.get(key)?.[targetLocale];
    if (!target || target === key || !output) continue;
    const regex = new RegExp('(^|[^\\p{L}\\p{N}])(' + escapeRegExp(key) + ')(?=$|[^\\p{L}\\p{N}])', 'giu');
    output = output.replace(regex, (_whole, prefix, found) => prefix + capitalizeLike(found, target));
  }
  return leading + output + trailing;
}

function translateTextNode(node) {
  if (!node || !node.parentElement || excluded(node.parentElement)) return;
  const current = node.nodeValue || '';
  let state = TEXT_STATE.get(node);
  if (!state || current !== state.output) {
    state = { source: current, output: current };
    TEXT_STATE.set(node, state);
  }
  const next = translateText(state.source, locale);
  if (next !== current) {
    state.output = next;
    TEXT_STATE.set(node, state);
    node.nodeValue = next;
  } else {
    state.output = current;
    TEXT_STATE.set(node, state);
  }
}

function translateAttributes(element) {
  if (!element || element.nodeType !== 1) return;
  const attributeExclusions = ['script','style','noscript','code','pre','[contenteditable="true"]','[data-no-translate]','.xterm','.xterm-screen','.xterm-rows','.terminal-output','.command-output','.doc-page','.sheet-cell','.sheet-grid','.slides-canvas','.ProseMirror','.tiptap','.editor-content'].concat(exclusions);
  try { if (element.closest(attributeExclusions.join(','))) return; } catch { return; }
  const attrs = ['title', 'placeholder', 'aria-label'];
  let state = ATTR_STATE.get(element);
  if (!state) { state = new Map(); ATTR_STATE.set(element, state); }
  for (const attr of attrs) {
    const current = element.getAttribute(attr);
    if (current === null) continue;
    let item = state.get(attr);
    if (!item || current !== item.output) item = { source: current, output: current };
    const next = translateText(item.source, locale);
    if (next !== current) {
      item.output = next;
      element.setAttribute(attr, next);
    } else item.output = current;
    state.set(attr, item);
  }
}

function translateTree(root) {
  if (!root) return;
  if (root.nodeType === 3) { translateTextNode(root); return; }
  if (root.nodeType !== 1 && root.nodeType !== 9 && root.nodeType !== 11) return;
  if (root.nodeType === 1) {
    const formControl = root.matches('input,textarea');
    if (excluded(root) && !formControl) return;
    if (!excluded(root) || formControl) translateAttributes(root);
  }
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let node;
  while ((node = walker.nextNode())) translateTextNode(node);
  if (root.querySelectorAll) {
    for (const element of root.querySelectorAll('*')) {
      const formControl = element.matches('input,textarea');
      if (!excluded(element) || formControl) translateAttributes(element);
    }
  }
}

function applyLocale(nextLocale) {
  locale = LOCALES.some((l) => l.code === nextLocale) ? nextLocale : 'fr';
  document.documentElement.lang = locale;
  const select = document.querySelector('#apk-fold-language-picker select');
  if (select) select.value = locale;
  translateTree(document.body);
}

function addPicker(appId) {
  const wrapper = document.createElement('label');
  wrapper.id = 'apk-fold-language-picker';
  wrapper.setAttribute('data-no-translate', '');
  wrapper.setAttribute('aria-label', 'Interface language');
  const icon = document.createElement('span');
  icon.textContent = '🌐';
  icon.setAttribute('aria-hidden', 'true');
  const select = document.createElement('select');
  select.setAttribute('aria-label', 'Langue de l’interface');
  for (const item of LOCALES) {
    const option = document.createElement('option');
    option.value = item.code;
    option.textContent = item.label;
    select.appendChild(option);
  }
  wrapper.append(icon, select);
  document.body.appendChild(wrapper);

  const style = document.createElement('style');
  style.id = 'apk-fold-language-picker-style';
  style.textContent = '#apk-fold-language-picker{position:fixed;left:10px;bottom:calc(env(safe-area-inset-bottom,0px) + 92px);z-index:2147483000;display:grid;place-items:center;width:36px;height:36px;box-sizing:border-box;color:#f8f7ff;background:rgba(22,18,32,.94);border:1px solid rgba(255,255,255,.2);border-radius:12px;box-shadow:0 6px 24px rgba(0,0,0,.24);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);font:12px/1.25 system-ui,-apple-system,sans-serif}#apk-fold-language-picker span{font-size:18px;pointer-events:none}#apk-fold-language-picker select{position:absolute;inset:0;width:100%;height:100%;opacity:0;cursor:pointer;border:0}#apk-fold-language-picker option{color:#17131e;background:#fff}@media(min-width:800px){#apk-fold-language-picker{left:16px;bottom:16px}}@media(max-width:360px){#apk-fold-language-picker{left:6px;bottom:calc(env(safe-area-inset-bottom,0px) + 82px)}}';
  document.head.appendChild(style);
  select.addEventListener('change', () => {
    try { localStorage.setItem('apk-fold.language.' + appId, select.value); } catch {}
    applyLocale(select.value);
  });
}

export function initI18n(options = {}) {
  if (initialized || !document.body) return;
  initialized = true;
  exclusions = Array.isArray(options.exclude) ? options.exclude : [];
  const appId = String(options.app || 'app').replace(/[^a-z0-9_-]/gi, '-');
  let saved = '';
  try { saved = localStorage.getItem('apk-fold.language.' + appId) || ''; } catch {}
  const browserLanguage = String((navigator.languages && navigator.languages[0]) || navigator.language || 'fr').slice(0, 2).toLowerCase();
  locale = LOCALES.some((l) => l.code === saved) ? saved : (LOCALES.some((l) => l.code === browserLanguage) ? browserLanguage : 'fr');
  addPicker(appId);
  applyLocale(locale);
  observer = new MutationObserver((records) => {
    for (const record of records) {
      if (record.type === 'characterData') translateTextNode(record.target);
      else if (record.type === 'childList') record.addedNodes.forEach(translateTree);
      else if (record.type === 'attributes') translateAttributes(record.target);
    }
  });
  observer.observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ['title', 'placeholder', 'aria-label'] });
}
