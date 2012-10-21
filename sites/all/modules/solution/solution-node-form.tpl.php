<div class="node-add-wrapper clear-block">
    <div class="node-column-main">
        <?php if ($form): ?>
            <?php 
                  print render($form['title']);
                  print render($form['problem_content']);
                  print render($form['field_solution_latex']);
                  print render($form['field_solution_problem']);
                  print drupal_render_children($form);
           ?>
        <?php endif; ?>
</div>
</div>
